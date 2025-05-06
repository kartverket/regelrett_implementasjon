package no.bekk.configuration

import com.charleskorn.kaml.Yaml
import com.charleskorn.kaml.YamlConfiguration
import com.charleskorn.kaml.YamlList
import com.charleskorn.kaml.YamlMap
import com.charleskorn.kaml.YamlNode
import com.charleskorn.kaml.YamlNull
import com.charleskorn.kaml.YamlScalar
import com.charleskorn.kaml.yamlMap
import com.charleskorn.kaml.yamlScalar
import no.bekk.util.logger
import java.nio.file.Path
import kotlin.io.path.Path
import kotlin.io.path.absolutePathString
import kotlin.io.path.exists
import kotlin.io.path.readText
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.primaryConstructor

class ConfigBuilder {
    private lateinit var homePath: String
    private lateinit var configYaml: YamlNode
    private val customInitPath = "conf/custom.yaml"
    private val configFiles = mutableListOf<String>()

    private lateinit var formConfig: FormConfig
    private lateinit var microsoftGraphConfig: MicrosoftGraphConfig
    private lateinit var oAuthConfig: OAuthConfig
    private lateinit var serverConfig: ServerConfig
    private lateinit var databaseConfig: DatabaseConfig
    private lateinit var answerHistoryConfig: AnswerHistoryCleanupConfig

    fun setHomePath(args: CommandLineArgs): ConfigBuilder {
        if (args.homePath != "") {
            homePath = args.homePath
            return this
        }

        try {
            homePath = Path("").absolutePathString()
        } catch (e: Exception) {
            System.exit(-1)
        }

        if (Path(homePath, "conf/defaults.yaml").exists()) {
            return this
        }

        if (Path(Path(homePath).parent.absolutePathString(), "conf/defaults.yaml").exists()) {
            homePath = Path(homePath).parent.absolutePathString()
            return this
        }

        return this
    }

    fun loadConfigurationFile(args: CommandLineArgs): ConfigBuilder {
        val defaultConfigFile = Path(homePath, "conf/defaults.yaml").absolutePathString()
        configFiles.add(defaultConfigFile)

        if (!Path(defaultConfigFile).exists()) {
            logger.error("Regelrett server Init Failed: Could not find config defaults, make sure homepath command line parameter is set or working directory is homepath")
            System.exit(1)
        }

        val file = Path(defaultConfigFile)

        val defaultsYamlString = try {
            file.readText()
        } catch (e: Exception) {
            logger.error("Unable to read defaults.yaml", e)
            System.exit(1)
            return this
        }

        var parsedFile = try {
            Yaml(configuration = YamlConfiguration(strictMode = false)).parseToYamlNode(defaultsYamlString)
        } catch (e: Exception) {
            logger.error("Failed to parse defaults.yaml", e)
            System.exit(1)
            return this
        }

        // TODO: Implement commandline properties e.g. cfg:database_name=database

        try {
            configYaml = loadSpecifiedConfigFile(args.configFile, parsedFile)
        } catch (e: Exception) {
            logger.error("Failed to load specified config file ${args.configFile}", e)
            System.exit(1)
            return this
        }

        // TODO: Apply env variables
        // TODO: Apply command line overrides
        // TODO: Expand config values containing environment variables
        // TODO: Init logging

        return this
    }

    private fun loadSpecifiedConfigFile(configFile: String, mainConfigYaml: YamlNode): YamlNode {
        var customFile = Path(configFile)
        if (configFile == "") {
            customFile = Path(homePath, customInitPath)
            if (!customFile.exists()) {
                return mainConfigYaml
            }
        }

        val customYamlString = try {
            customFile.readText()
        } catch (e: Exception) {
            logger.error("Failed to read: $customFile", e)
            throw e
        }

        val customConfig = try {
            Yaml(configuration = YamlConfiguration(strictMode = false)).parseToYamlNode(customYamlString)
        } catch (e: Exception) {
            logger.error("Failed to parse Yaml: $customFile", e)
            throw e
        }

        val newConfigYaml = try {
            applyCustomConfigYaml(customConfig, mainConfigYaml)
        } catch (e: Exception) {
            logger.error("Failed to apply Yaml: $customFile", e)
            throw e
        }

        configFiles.add(customFile.absolutePathString())

        return newConfigYaml
    }

    private fun applyCustomConfigYaml(userConfig: YamlNode, mainYaml: YamlNode): YamlNode {
        val defaultSections: MutableMap<YamlScalar, YamlNode> = mainYaml.yamlMap.entries.toMutableMap()

        for (userSection in userConfig.yamlMap.entries) {
            val defaultProperties: MutableMap<YamlScalar, YamlNode> =
                defaultSections
                    .get(
                        defaultSections.keys.firstOrNull {
                            it.equivalentContentTo(userSection.key)
                        },
                    )
                    ?.yamlMap
                    ?.entries
                    ?.toMutableMap()
                    ?: mutableMapOf()

            for (userProperty in userSection.value.yamlMap.entries) {
                if (userProperty.value.contentToString() == "") {
                    continue
                } else {
                    defaultProperties.set(
                        defaultProperties
                            .keys
                            .firstOrNull { it.equivalentContentTo(userProperty.key) }
                            ?: userProperty.key,
                        userProperty.value,
                    )
                }
            }

            defaultSections.set(
                defaultSections
                    .keys
                    .firstOrNull { it.equivalentContentTo(userSection.key) }
                    ?: userSection.key,
                userSection.value.yamlMap.copy(entries = defaultProperties),
            )
        }

        return mainYaml.yamlMap.copy(entries = defaultSections)
    }

    inline fun <reified T : Any> mergeConfigYaml(target: T, other: T): T {
        val propertiesByName = T::class.declaredMemberProperties.associateBy { it.name }
        val primaryConstructor = T::class.primaryConstructor ?: throw IllegalArgumentException("Merge target must have a primary constructor")
        val args = primaryConstructor.parameters.associateWith { parameter ->
            val property = propertiesByName[parameter.name] ?: throw IllegalStateException("No declared member property found with name ${parameter.name}")
            (property.get(other) ?: property.get(target))
        }

        return primaryConstructor.callBy(args)
    }

    fun buildFormConfig(yaml: YamlNode): FormConfig = FormConfig(
        airTable = AirTableConfig(
            baseUrl = yaml.getString("airtable_base_url", "schema_sources", "https://api.airtable.com"),
        ),
        forms = yaml.getSection("schema_sources").get<YamlList>("sources")?.let {
            it.items.map { sourceYaml ->
                val type = sourceYaml.yamlMap.get<YamlScalar>("type")?.content
                try {
                    when (type) {
                        "AIRTABLE" -> AirTableInstanceConfig(
                            id = sourceYaml.getString("id"),
                            accessToken = sourceYaml.getString("accessToken"),
                            baseId = sourceYaml.getString("baseId"),
                            tableId = sourceYaml.getString("tableId"),
                            viewId = sourceYaml.getStringOrNull("viewId"),
                            webhookId = sourceYaml.getStringOrNull("webhookId"),
                            webhookSecret = sourceYaml.getStringOrNull("webhookSecret"),
                        )

                        "YAML" -> YAMLInstanceConfig(
                            id = sourceYaml.getString("id"),
                            endpoint = sourceYaml.getStringOrNull("endpoint"),
                            resourcePath = sourceYaml.getStringOrNull("resourcePath"),
                        )

                        else -> throw IllegalStateException("Illegal type \"$type\"")
                    }
                } catch (e: Exception) {
                    logger.error("The following exception happened while building config element schema_sources.sources[]", e)
                    null
                }
            }.filterNotNull()
        } ?: listOf(),
    )

    fun buildMicrosoftGraphConfig(yaml: YamlNode) = MicrosoftGraphConfig(
        baseUrl = yaml.getString("baseUrl", "microsoft_graph", "https://graph.microsoft.com"),
        memberOfPath = yaml.getString("memberOfPath", "microsoft_graph", "/v1.0/me/memberOf/microsoft.graph.group"),
    )

    fun buildOAuthConfig(yaml: YamlNode): OAuthConfig = OAuthConfig(
        baseUrl = yaml.getString("baseUrl", "oAuth", "https://login.microsoftonline.com"),
        tenantId = yaml.getString("tenantId", "oAuth"),
        issuerPath = yaml.getString("issuerPath", "oAuth", "/v2.0"),
        authPath = yaml.getString("authPath", "oAuth", "/oauth2/v2.0/authorize"),
        tokenPath = yaml.getString("tokenPath", "oAuth", "/oauth2/v2.0/token"),
        jwksPath = yaml.getString("jwksPath", "oAuth", "/discovery/v2.0/keys"),
        clientId = yaml.getString("clientId", "oAuth"),
        clientSecret = yaml.getString("clientSecret", "oAuth"),
        providerUrl = yaml.getString("providerUrl", "oAuth", "http://localhost:8080/callback"),
        superUserGroup = yaml.getString("superUserGroup", "oAuth", ""),
    )

    fun buildServerConfig(yaml: YamlNode): ServerConfig = ServerConfig(
        host = "${yaml.getString("domain", "server", "localhost")}:${yaml.getString("http_port", "server", "8080")}",
        httpAddr = yaml.getString("http_addr", "server", "0.0.0.0"),
        httpPort = yaml.getInt("http_port", "server", 8080),
        routerLogging = yaml.getBool("router_logging", "server", false),
        allowedOrigins = yaml.getString("allowed_origins", "server", "").split(","),
    )
    fun buildDatabaseConfig(yaml: YamlNode): DatabaseConfig = DatabaseConfig(
        url = "jdbc:postgresql://${yaml.getString("host", "database", "127.0.0.1:5432")}/${yaml.getString("name", "database", "regelrett")}",
        username = yaml.getString("user", "database", "postgres"),
        password = yaml.getString("password", "database", ""),
    )
    fun buildAnswerHistoryConfig(yaml: YamlNode): AnswerHistoryCleanupConfig = AnswerHistoryCleanupConfig(
        cleanupIntervalWeeks = yaml.getString("cleanupIntervalWeeks", "answerHistoryCleanup", "4"),
    )

    fun build(): Config {
        formConfig = buildFormConfig(configYaml)
        microsoftGraphConfig = buildMicrosoftGraphConfig(configYaml)
        oAuthConfig = buildOAuthConfig(configYaml)
        serverConfig = buildServerConfig(configYaml)
        databaseConfig = buildDatabaseConfig(configYaml)
        answerHistoryConfig = buildAnswerHistoryConfig(configYaml)

        return Config(
            environment = configYaml.getString("environment", "base", "development"),
            forms = formConfig,
            microsoftGraph = microsoftGraphConfig,
            oAuth = oAuthConfig,
            server = serverConfig,
            database = databaseConfig,
            answerHistoryCleanup = answerHistoryConfig,
            raw = configYaml,
        )
    }
}

fun newConfigFromArgs(args: CommandLineArgs): Config {
    val builder = ConfigBuilder()

    try {
        return builder
            .setHomePath(args)
            .loadConfigurationFile(args)
            .build()
    } catch (e: Exception) {
        logger.error("Failed to setup application configuration.", e)
        System.exit(1)
        throw e
    }
}

fun YamlNode.getSection(section: String): YamlMap = this.yamlMap.get<YamlMap>(section)
    ?: throw IllegalArgumentException("Missing section $section")

fun YamlMap.getProperty(
    key: String,
): YamlNode = this.get<YamlNode>(key)
    ?: throw IllegalArgumentException("Missing property $key")

fun YamlNode.getValue(
    key: String,
    section: String? = null,
): YamlNode {
    try {
        val yamlSection = if (section != null) {
            this.getSection(section)
        } else {
            this.yamlMap
        }

        return yamlSection.getProperty(key)
    } catch (e: Exception) {
        if (section != null) {
            logger.error("Unable to build $section.$key from Yaml:", e)
        } else {
            logger.error("Unable to build $key from Yaml:", e)
        }
        throw e
    }
}

fun YamlNode.getString(
    key: String,
    section: String? = null,
    default: String? = null,
): String {
    val value = this.getValue(key, section)
    return if (value is YamlNull) {
        default ?: throw IllegalStateException("Unable to initialize app config. Value of $section.$key is null. Expected string")
    } else {
        value.yamlScalar.content
    }
}

fun YamlNode.getInt(
    key: String,
    section: String? = null,
    default: Int? = null,
): Int {
    val value = getValue(key, section)
    return if (value is YamlNull) {
        default ?: throw IllegalStateException("Value of $section.$key is null. Expected integer")
    } else {
        value.yamlScalar.toInt()
    }
}

fun YamlNode.getBool(
    key: String,
    section: String? = null,
    default: Boolean? = null,
): Boolean {
    val value = getValue(key, section)
    return if (value is YamlNull) {
        default ?: throw IllegalStateException("Unable to initialize app config. Value of $section.$key is null. Expected boolean")
    } else {
        value.yamlScalar.toBoolean()
    }
}

fun YamlNode.getStringOrNull(
    key: String,
    section: String? = null,
    default: String? = null,
): String? {
    val yamlSection = if (section != null) {
        this.yamlMap.get<YamlMap>(section)
    } else {
        this.yamlMap
    }
    val value = yamlSection?.get<YamlNode>(key)
    return if (value == null || value is YamlNull) {
        default
    } else {
        value.yamlScalar.content
    }
}
