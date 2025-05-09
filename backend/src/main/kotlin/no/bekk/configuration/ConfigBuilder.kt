package no.bekk.configuration

import net.mamoe.yamlkt.YamlMap
import no.bekk.configuration.decodeYamlFromFile
import no.bekk.util.logger
import java.nio.file.Path
import kotlin.collections.emptyList
import kotlin.io.path.Path
import kotlin.io.path.absolutePathString
import kotlin.io.path.exists
import kotlin.io.path.pathString

class ConfigBuilder {
    private lateinit var homePath: String

    private lateinit var configYaml: YamlConfig

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

        val parsedFile2 = decodeYamlFromFile(defaultConfigFile)

        // TODO: Implement commandline properties e.g. cfg:database_name=database

        try {
            configYaml = YamlConfig(loadSpecifiedConfigFile(args.configFile, parsedFile2))
        } catch (e: Exception) {
            logger.error("Failed to load specified config file ${args.configFile}", e)
            System.exit(1)
            return this
        }

        // TODO: Apply env variables
        // TODO: Apply command line overrides
        // TODO: Init logging

        return this
    }

    fun loadSpecifiedConfigFile(customConfigFile: String, defaultConfigYaml: YamlMap): YamlMap {
        var customFile = Path(customConfigFile)
        if (customConfigFile == "") {
            customFile = Path(homePath, customInitPath)
            if (!customFile.exists()) {
                return defaultConfigYaml
            }
        }

        val customConfigYaml = decodeYamlFromFile(customFile.pathString)

        return try {
            mergeConfigYaml(customConfigYaml, defaultConfigYaml).also {
                configFiles.add(customFile.absolutePathString())
            }
        } catch (e: Exception) {
            logger.error("Unable to merge $customConfigFile with default yaml:", e)
            throw e
        }
    }

    fun buildFormConfig(yaml: YamlConfig): FormConfig = FormConfig(
        airTable = AirTableConfig(
            baseUrl = yaml.getStringOrNull("schema_sources", "airtable_base_url") ?: "https://api.airtable.com",
        ),
        forms = yaml.getListOfMaps("schema_sources", "sources")
            .map { sourceYaml ->
                val type = sourceYaml.getString("type")
                try {
                    when (type) {
                        "AIRTABLE" -> AirTableInstanceConfig(
                            id = sourceYaml.getString("id"),
                            accessToken = sourceYaml.getString("access_token"),
                            baseId = sourceYaml.getString("base_id"),
                            tableId = sourceYaml.getString("table_id"),
                            viewId = sourceYaml.getStringOrNull("view_id"),
                            webhookId = sourceYaml.getStringOrNull("webhook_id"),
                            webhookSecret = sourceYaml.getStringOrNull("webhook_secret"),
                        )

                        "YAML" -> YAMLInstanceConfig(
                            id = sourceYaml.getString("id"),
                            endpoint = sourceYaml.getStringOrNull("endpoint"),
                            resourcePath = sourceYaml.getStringOrNull("resource_path"),
                        )

                        else -> throw IllegalStateException("Illegal type \"$type\"")
                    }
                } catch (e: Exception) {
                    logger.error("The following exception happened while building config element schema_sources.sources[]", e)
                    null
                }
            }.filterNotNull(),
    )

    fun buildMicrosoftGraphConfig(yaml: YamlConfig) = MicrosoftGraphConfig(
        baseUrl = yaml.getStringOrNull("microsoft_graph", "base_url") ?: "https://graph.microsoft.com",
        memberOfPath = yaml.getStringOrNull("microsoft_graph", "member_of_path") ?: "/v1.0/me/memberOf/microsoft.graph.group",
    )

    fun buildOAuthConfig(yaml: YamlConfig): OAuthConfig = OAuthConfig(
        baseUrl = yaml.getStringOrNull("oauth", "base_url") ?: "https://login.microsoftonline.com",
        tenantId = yaml.getString("oauth", "tenant_id"),
        issuerPath = yaml.getStringOrNull("oauth", "issuer_path") ?: "/v2.0",
        authPath = yaml.getStringOrNull("oauth", "auth_path") ?: "/oauth2/v2.0/authorize",
        tokenPath = yaml.getStringOrNull("oauth", "token_path") ?: "/oauth2/v2.0/token",
        jwksPath = yaml.getStringOrNull("oauth", "jwks_path") ?: "/discovery/v2.0/keys",
        clientId = yaml.getString("oauth", "client_id"),
        clientSecret = yaml.getString("oauth", "client_secret"),
        superUserGroup = yaml.getStringOrNull("oauth", "super_user_group") ?: "",
    )

    fun buildServerConfig(yaml: YamlConfig): ServerConfig = ServerConfig(
        host = "${yaml.getStringOrNull("server", "domain") ?: "localhost"}:${yaml.getStringOrNull("server", "http_port") ?: "8080"}",
        httpAddr = yaml.getStringOrNull("server", "http_addr") ?: "0.0.0.0",
        httpPort = yaml.getIntOrNull("server", "http_port") ?: 8080,
        routerLogging = yaml.getBoolOrNull("server", "router_logging") ?: false,
        allowedOrigins = yaml.getStringOrNull("server", "allowed_origins")?.split(",") ?: emptyList(),
    )

    fun buildDatabaseConfig(yaml: YamlConfig): DatabaseConfig {
        val host = yaml.getStringOrNull("database", "host") ?: "127.0.0.1:5432"
        val name = yaml.getStringOrNull("database", "name") ?: "regelrett"
        return DatabaseConfig(
            url = "jdbc:postgresql://$host/$name",
            username = yaml.getStringOrNull("database", "user") ?: "postgres",
            password = yaml.getStringOrNull("database", "password") ?: "",
        )
    }

    fun buildAnswerHistoryConfig(yaml: YamlConfig): AnswerHistoryCleanupConfig = AnswerHistoryCleanupConfig(
        cleanupIntervalWeeks = yaml.getStringOrNull("answer_history_cleanup", "cleanup_interval_weeks") ?: "4",
    )

    fun build(): Config {
        formConfig = buildFormConfig(configYaml)
        microsoftGraphConfig = buildMicrosoftGraphConfig(configYaml)
        oAuthConfig = buildOAuthConfig(configYaml)
        serverConfig = buildServerConfig(configYaml)
        databaseConfig = buildDatabaseConfig(configYaml)
        answerHistoryConfig = buildAnswerHistoryConfig(configYaml)

        return Config(
            environment = configYaml.getStringOrNull("base", "environment") ?: "development",
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
