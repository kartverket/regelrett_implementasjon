package no.bekk.configuration

import com.charleskorn.kaml.YamlList
import com.charleskorn.kaml.YamlMap
import com.charleskorn.kaml.YamlNode
import com.charleskorn.kaml.YamlScalar
import com.charleskorn.kaml.yamlMap
import io.ktor.server.config.*
import kotlin.collections.listOf

data class Config(
    val environment: String,
    val formConfig: FormConfig,
    val microsoftGraph: MicrosoftGraphConfig,
    val oAuth: OAuthConfig,
    val server: ServerConfig,
    val db: DbConfig,
    val answerHistoryCleanup: AnswerHistoryCleanupConfig,
    val allowedCORSHosts: List<String>,
    val raw: YamlNode,
)

data class CommandLineArgs(
    val args: Array<String>,
) {
    var configFile: String = ""
    var homePath: String = ""
}

fun newConfigFromArgs(args: CommandLineArgs): Config {
    val builder = ConfigBuilder()

    try {
        builder
            .setHomePath(args)
            .loadConfigurationFile(args)
    } catch (e: Exception) {
        // TODO
        System.exit(1)
    }
    return builder.build()
}

class FormConfig(
    val airTable: AirTableConfig,
    val forms: List<FormInstances>,
) {
    companion object {
        fun load(cfg: YamlMap): FormConfig = FormConfig(
            airTable = AirTableConfig(
                baseUrl = cfg.get<YamlScalar>("airtable_base_url")?.content ?: "https://api.airtable.com",
            ),
            forms = cfg.get<YamlList>("sources")?.let {
                it.items.map { sourceYaml ->
                    val type = sourceYaml.yamlMap.get<YamlScalar>("type")?.content
                    when (type) {
                        "AIRTABLE" -> AirTableInstanceConfig(
                            id = sourceYaml.yamlMap.get<YamlScalar>("id")?.content
                                ?: throw MissingConfigPropertyException("[schema_sources.sources].id"),
                            accessToken = sourceYaml.yamlMap.get<YamlScalar>("accessToken")?.content
                                ?: throw MissingConfigPropertyException("[schema_sources.sources].accessToken"),
                            baseId = sourceYaml.yamlMap.get<YamlScalar>("baseId")?.content
                                ?: throw MissingConfigPropertyException("[schema_sources.sources].baseId"),
                            tableId = sourceYaml.yamlMap.get<YamlScalar>("tableId")?.content
                                ?: throw MissingConfigPropertyException("[schema_sources.sources].tableId"),
                            viewId = sourceYaml.yamlMap.get<YamlScalar>("viewId")?.content,
                            webhookId = sourceYaml.yamlMap.get<YamlScalar>("webhookId")?.content,
                            webhookSecret = sourceYaml.yamlMap.get<YamlScalar>("webhookSecret")?.content,
                        )

                        "YAML" -> YAMLInstanceConfig(
                            id = sourceYaml.yamlMap.get<YamlScalar>("id")?.content
                                ?: throw MissingConfigPropertyException("[schema_sources.sources].id"),
                            endpoint = sourceYaml.yamlMap.get<YamlScalar>("endpoint")?.content,
                            resourcePath = sourceYaml.yamlMap.get<YamlScalar>("resourcePath")?.content,
                        )

                        else -> throw IllegalStateException("Illegal type \"$type\"")
                    }
                }
            } ?: listOf(),
        )
    }
}

data class AirTableConfig(
    val baseUrl: String,
)

interface FormInstances {
    val id: String
}

data class AirTableInstanceConfig(
    override val id: String,
    val accessToken: String,
    val baseId: String,
    val tableId: String,
    var viewId: String? = null,
    var webhookId: String? = null,
    var webhookSecret: String? = null,
) : FormInstances

data class YAMLInstanceConfig(
    override val id: String,
    val endpoint: String? = null,
    val resourcePath: String? = null,
) : FormInstances

class MicrosoftGraphConfig(
    val baseUrl: String,
    val memberOfPath: String,
) {
    companion object {
        fun load(cfg: YamlMap): MicrosoftGraphConfig = MicrosoftGraphConfig(
            baseUrl = cfg.get<YamlScalar>("baseUrl")?.content ?: "https://graph.microsoft.com",
            memberOfPath = cfg.get<YamlScalar>("memberOfPath")?.content ?: "/v1.0/me/memberOf/microsoft.graph.group",
        )
    }
}

class OAuthConfig(
    val baseUrl: String,
    val tenantId: String,
    val issuerPath: String,
    val authPath: String,
    val tokenPath: String,
    val jwksPath: String,
    val clientId: String,
    val clientSecret: String,
    val providerUrl: String,
    val superUserGroup: String,
) {
    companion object {
        fun load(cfg: YamlMap): OAuthConfig = OAuthConfig(
            baseUrl = cfg.get<YamlScalar>("baseUrl")?.content ?: "https://login.microsoftonline.com",
            tenantId = cfg.get<YamlScalar>("tenantId")?.content ?: throw MissingConfigPropertyException("oAuth.tenantId"),
            issuerPath = cfg.get<YamlScalar>("issuerPath")?.content ?: "/v2.0",
            authPath = cfg.get<YamlScalar>("authPath")?.content ?: "/oauth2/v2.0/authorize",
            tokenPath = cfg.get<YamlScalar>("tokenPath")?.content ?: "/oauth2/v2.0/token",
            jwksPath = cfg.get<YamlScalar>("jwksPath")?.content ?: "/discovery/v2.0/keys",
            clientId = cfg.get<YamlScalar>("clientId")?.content ?: throw MissingConfigPropertyException("oAuth.clientId"),
            clientSecret = cfg.get<YamlScalar>("clientSecret")?.content ?: throw MissingConfigPropertyException("oAuth.clientSecret"),
            providerUrl = cfg.get<YamlScalar>("providerUrl")?.content ?: "http://localhost:8080/callback",
            superUserGroup = cfg.get<YamlScalar>("superUserGroup")?.content ?: "",
        )
    }
}

fun getIssuer(oAuthConfig: OAuthConfig) = oAuthConfig.baseUrl + "/" + oAuthConfig.tenantId + oAuthConfig.issuerPath
fun getTokenUrl(oAuthConfig: OAuthConfig) = oAuthConfig.baseUrl + "/" + oAuthConfig.tenantId + oAuthConfig.tokenPath
fun getJwksUrl(oAuthConfig: OAuthConfig) = oAuthConfig.baseUrl + "/" + oAuthConfig.tenantId + oAuthConfig.jwksPath

class ServerConfig(
    val host: String,
    val httpAddr: String,
    val httpPort: Int,
    val routerLogging: Boolean,
) {
    companion object {
        fun load(cfg: YamlMap): ServerConfig = ServerConfig(
            host = "${cfg.get<YamlScalar>("domain")?.content ?: "localhost"}:${cfg.get<YamlScalar>("http_port")?.content ?: "8080"}",
            httpAddr = cfg.get<YamlScalar>("http_addr")?.content ?: "0.0.0.0",
            httpPort = cfg.get<YamlScalar>("http_port")?.toInt() ?: 8080,
            routerLogging = cfg.get<YamlScalar>("router_logging")?.toBoolean() ?: false,
        )
    }
}

class DbConfig(
    val url: String,
    val username: String,
    val password: String,
) {
    companion object {
        fun load(cfg: YamlMap): DbConfig = DbConfig(
            url = "jdbc:postgresql://${cfg.get<YamlScalar>("host")?.content ?: "127.0.0.1:5432"}/${cfg.get<YamlScalar>("name")?.content ?: "regelrett"}",
            username = cfg.get<YamlScalar>("user")?.content ?: "postgres",
            password = cfg.get<YamlScalar>("password")?.content ?: "",
        )
    }
}

class AnswerHistoryCleanupConfig(
    val cleanupIntervalWeeks: String,
) {
    companion object {
        fun load(cfg: YamlMap): AnswerHistoryCleanupConfig = AnswerHistoryCleanupConfig(
            cleanupIntervalWeeks = cfg.get<YamlScalar>("cleanupIntervalWeeks")?.content ?: "4",
        )
    }
}

class MissingConfigPropertyException(prop: String, cause: Throwable? = null) : IllegalStateException("Unable to initialize app config. Missing property $prop", cause)

fun ApplicationConfig.requireProperty(key: String): String = this.propertyOrNull(key)?.getString()
    ?: throw IllegalStateException("Unable to initialize app config \"$key\"")
