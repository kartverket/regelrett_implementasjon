package no.bekk.configuration

import io.ktor.server.config.*


data class AppConfig(
    val formConfig: FormConfig,
    val microsoftGraph: MicrosoftGraphConfig,
    val oAuth: OAuthConfig,
    val frontend: FrontendConfig,
    val backend: BackendConfig,
    val db: DbConfig,
    val answerHistoryCleanup: AnswerHistoryCleanupConfig,
    val allowedCORSHosts: List<String>
) {
    companion object {
        fun load(config: ApplicationConfig): AppConfig {
            val allowedCORSHosts = System.getenv("ALLOWED_CORS_HOSTS").split(",")

            return AppConfig(
                formConfig = FormConfig(
                    airTable = AirTableConfig(
                        baseUrl = config.propertyOrNull("airTable.baseUrl")
                            ?.getString()
                            ?: throw IllegalStateException("Unable to initialize app config \"airTable.baseUrl\"")
                    ),
                    forms = config.configList("forms").map { table ->

                        when (table.propertyOrNull("type")?.getString()) {
                            "AIRTABLE" -> AirTableInstanceConfig(
                                id = table.propertyOrNull("id")?.getString()
                                    ?: throw IllegalStateException("Unable to initialize app config \"id\""),
                                accessToken = table.propertyOrNull("accessToken")?.getString()
                                    ?: throw IllegalStateException("Unable to initialize app config \"accessToken\""),
                                baseId = table.propertyOrNull("baseId")?.getString()
                                    ?: throw IllegalStateException("Unable to initialize app config \"baseId\""),
                                tableId = table.propertyOrNull("tableId")?.getString()
                                    ?: throw IllegalStateException("Unable to initialize app config \"tableId\""),
                                viewId = table.propertyOrNull("viewId")?.getString(),
                                webhookId = table.propertyOrNull("webhookId")?.getString(),
                                webhookSecret = table.propertyOrNull("webhookSecret")?.getString(),
                            )

                            "YAML" -> YAMLInstanceConfig(
                                id = table.propertyOrNull("id")?.getString()
                                    ?: throw IllegalStateException("Unable to initialize app config \"id\""),
                                endpoint = table.propertyOrNull("endpoint")?.getString() ?: throw IllegalStateException(
                                    "Unable to initialize app config \"baseId\""
                                ),
                                resourcePath = table.propertyOrNull("resourcePath")?.getString()
                                    ?: throw IllegalStateException("Unable to initialize app config \"tableId\""),
                            )

                            else -> throw IllegalStateException("Illegal type \"type\"")

                        }

                    }

                ),
                microsoftGraph = MicrosoftGraphConfig(
                    baseUrl = config.propertyOrNull("microsoftGraph.baseUrl")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"microsoftGraph.baseUrl\""),
                    memberOfPath = config.propertyOrNull("microsoftGraph.memberOfPath")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"microsoftGraph.memberOfPath\"")
                ),
                oAuth = OAuthConfig(
                    baseUrl = config.propertyOrNull("oAuth.baseUrl")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"oAuth.baseurl\""),
                    tenantId = config.propertyOrNull("oAuth.tenantId")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"oAuth.tenantId\""),
                    issuerPath = config.propertyOrNull("oAuth.issuerPath")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"oAuth.issuerPath\""),
                    authPath = config.propertyOrNull("oAuth.authPath")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"oAuth.authPath\""),
                    tokenPath = config.propertyOrNull("oAuth.tokenPath")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"oAuth.tokenPath\""),
                    jwksPath = config.propertyOrNull("oAuth.jwksPath")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"oAuth.jwksPath\""),
                    clientId = config.propertyOrNull("oAuth.clientId")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"oAuth.clientId\""),
                    clientSecret = config.propertyOrNull("oAuth.clientSecret")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"oAuth.clientSecret\""),
                    providerUrl = config.propertyOrNull("oAuth.providerUrl")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"oAuth.providerUrl\""),
                    superUserGroup = config.propertyOrNull("oAuth.superUserGroup")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"oAuth.superUserGroup\"")
                ),
                frontend = FrontendConfig(
                    host = config.propertyOrNull("frontend.host")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"frontend.host\"")
                ),
                backend = BackendConfig(
                    host = config.propertyOrNull("backend.host")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"backend.host\"")
                ),
                db = DbConfig(
                    url = config.propertyOrNull("db.url")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"db.url\""),
                    username = config.propertyOrNull("db.username")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"db.username\""),
                    password = config.propertyOrNull("db.password")?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"db.password\"")
                ),
                answerHistoryCleanup = AnswerHistoryCleanupConfig(
                    cleanupIntervalWeeks = config.propertyOrNull("answerHistoryCleanup.cleanupIntervalWeeks")
                        ?.getString()
                        ?: throw IllegalStateException("Unable to initialize app config \"answerHistoryCleanup.cleanupIntervalWeeks\"")
                ),
                allowedCORSHosts = allowedCORSHosts
            )
        }
    }
}

data class FormConfig(
    val airTable: AirTableConfig,
    val forms: List<FormInstances>
)

data class AirTableConfig(
    val baseUrl: String
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
    val resourcePath: String? = null
) : FormInstances


data class MicrosoftGraphConfig(
    val baseUrl: String,
    val memberOfPath: String
)

data class OAuthConfig(
    val baseUrl: String,
    val tenantId: String,
    val issuerPath: String,
    val authPath: String,
    val tokenPath: String,
    val jwksPath: String,
    val clientId: String,
    val clientSecret: String,
    val providerUrl: String,
    val superUserGroup: String
)

fun getIssuer(config: AppConfig) = config.oAuth.baseUrl + "/" + config.oAuth.tenantId + config.oAuth.issuerPath
fun getTokenUrl(config: AppConfig) = config.oAuth.baseUrl + "/" + config.oAuth.tenantId + config.oAuth.tokenPath
fun getJwksUrl(config: AppConfig) = config.oAuth.baseUrl + "/" + config.oAuth.tenantId + config.oAuth.jwksPath


data class FrontendConfig(
    val host: String
)

data class BackendConfig(
    val host: String
)

data class DbConfig(
    val url: String,
    val username: String,
    val password: String
)

data class AnswerHistoryCleanupConfig(
    val cleanupIntervalWeeks: String
)
