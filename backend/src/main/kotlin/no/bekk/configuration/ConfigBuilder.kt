package no.bekk.configuration

import com.charleskorn.kaml.Yaml
import com.charleskorn.kaml.YamlConfiguration
import com.charleskorn.kaml.YamlMap
import com.charleskorn.kaml.YamlNode
import com.charleskorn.kaml.YamlScalar
import com.charleskorn.kaml.yamlMap
import kotlinx.serialization.Serializable
import no.bekk.configuration.MissingConfigPropertyException
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
                    .get(userSection.key)
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

    // private fun applyCustomConfigFile(userConfig: ConfigYaml, mainFile: ConfigYaml): ConfigYaml {
    //     val propertiesByName = ConfigYaml::class.declaredMemberProperties.associateBy { it.name }
    //     val primaryConstructor = ConfigYaml::class.primaryConstructor ?: throw IllegalArgumentException("Merge target must have a primary constructor")
    //     val args = primaryConstructor.parameters.associateWith { parameter ->
    //         val section = propertiesByName[parameter.name] ?: throw IllegalStateException("No declared member property found with name ${parameter.name}")
    //         val defaultSection = section.get(mainFile) ?: throw IllegalStateException("Section missing from default.conf: ${section.name}")
    //         val userSection = section.get(userConfig)
    //
    //         if (userSection == null) {
    //             defaultSection
    //         } else {
    //             mergeConfigYaml(defaultSection, userSection)
    //         }
    //     }
    //     return primaryConstructor.callBy(args)
    // }

    inline fun <reified T : Any> mergeConfigYaml(target: T, other: T): T {
        val propertiesByName = T::class.declaredMemberProperties.associateBy { it.name }
        val primaryConstructor = T::class.primaryConstructor ?: throw IllegalArgumentException("Merge target must have a primary constructor")
        val args = primaryConstructor.parameters.associateWith { parameter ->
            val property = propertiesByName[parameter.name] ?: throw IllegalStateException("No declared member property found with name ${parameter.name}")
            (property.get(other) ?: property.get(target))
        }

        return primaryConstructor.callBy(args)
    }

    fun build(): Config {
        val baseYaml = configYaml.yamlMap.get<YamlMap>("base")
            ?: throw MissingConfigPropertyException("schema_sources")
        val schemaSourcesYaml = configYaml.yamlMap.get<YamlMap>("schema_sources")
            ?: throw MissingConfigPropertyException("schema_sources")
        val microsoftGraphYaml = configYaml.yamlMap.get<YamlMap>("microsoft_graph")
            ?: throw MissingConfigPropertyException("microsoft_graph")
        val oAuthYaml = configYaml.yamlMap.get<YamlMap>("oAuth")
            ?: throw MissingConfigPropertyException("oAuth")
        val serverYaml = configYaml.yamlMap.get<YamlMap>("server")
            ?: throw MissingConfigPropertyException("server")
        val databaseYaml = configYaml.yamlMap.get<YamlMap>("database")
            ?: throw MissingConfigPropertyException("database")
        val answerHistoryCleanupYaml = configYaml.yamlMap.get<YamlMap>("answerHistoryCleanup")
            ?: throw MissingConfigPropertyException("answerHistoryCleanup")

        return Config(
            environment = baseYaml.get<YamlScalar>("environment")?.content ?: "development",
            formConfig = FormConfig.load(schemaSourcesYaml),
            microsoftGraph = MicrosoftGraphConfig.load(microsoftGraphYaml),
            oAuth = OAuthConfig.load(oAuthYaml),
            server = ServerConfig.load(serverYaml),
            db = DbConfig.load(databaseYaml),
            answerHistoryCleanup = AnswerHistoryCleanupConfig.load(answerHistoryCleanupYaml),
            allowedCORSHosts = System.getenv("ALLOWED_CORS_HOSTS").split(","),
            raw = configYaml,
        )
    }
}

@Serializable
data class ConfigYaml(
    var base: BaseConfigYaml? = null,
    var server: ServerConfigYaml? = null,
    var database: DatabaseConfigYaml? = null,
    var schema_sources: SchemaSourcesConfigYaml? = null,
    var microsoft_graph: MicrosoftGraphConfigYaml? = null,
    var oAuth: OAuthConfigYaml? = null,
    var answerHistoryCleanup: AnswerHistoryCleanupConfigYaml? = null,
)

@Serializable
data class BaseConfigYaml(
    var environment: String? = null,
)

@Serializable
data class ServerConfigYaml(
    var protocol: String? = null,
    var http_addr: String? = null,
    var http_port: String? = null,
    var domain: String? = null,
)

@Serializable
data class DatabaseConfigYaml(
    var host: String? = null,
    var name: String? = null,
    var user: String? = null,
    var password: String? = null,
    var max_idle_conn: Int? = null,
    var max_open_conn: Int? = null,
    var conn_max_lifetime: Int? = null,
    var log_queries: Boolean? = null,
    var ssl_mode: String? = null,
    var ssl_sni: String? = null,
    var migration_locking: Boolean? = false,
    var locking_attempt_timeout_sec: Int? = null,
)

@Serializable
data class SchemaSourcesConfigYaml(
    var airtable_base_url: String? = null,
    var sources: List<SourcesConfigYaml>? = null,
)

@Serializable
data class SourcesConfigYaml(
    var id: String? = null,
    var type: String? = null,
    var accessToken: String? = null,
    var baseId: String? = null,
    var tableId: String? = null,
    var viewId: String? = null,
    var webhookId: String? = null,
    var webhookSecret: String? = null,
    var endpoint: String? = null,
    var resourcePath: String? = null,
)

@Serializable
data class MicrosoftGraphConfigYaml(
    var baseUrl: String? = null,
    var memberOfPath: String? = null,
)

@Serializable
data class OAuthConfigYaml(
    var baseUrl: String? = null,
    var tenantId: String? = null,
    var issuerPath: String? = null,
    var authPath: String? = null,
    var tokenPath: String? = null,
    var jwksPath: String? = null,
    var clientId: String? = null,
    var clientSecret: String? = null,
    var providerUrl: String? = null,
    var superUserGroup: String? = null,
)

@Serializable
data class FrontendConfigYaml(
    var host: String? = null,
)

@Serializable
data class AnswerHistoryCleanupConfigYaml(
    var cleanupIntervalWeeks: String? = null,
)
