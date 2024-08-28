package no.bekk

import no.bekk.plugins.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.config.*
import no.bekk.authentication.initializeAuthentication
import no.bekk.authentication.installSessions
import no.bekk.configuration.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

private fun loadAppConfig(config: ApplicationConfig) {
    // Environment
    AppConfig.environment = config.propertyOrNull("ktor.environment")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"ktor.environment\"")

    // AirTable config
    AppConfig.airTable = AirTableConfig.apply {
        accessToken = config.propertyOrNull("airTable.accessToken")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"airTable.accessToken\"")
        baseUrl = config.propertyOrNull("airTable.baseUrl")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"airTable.baseUrl\"")
        metadataPath = config.propertyOrNull("airTable.metadataPath")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"airTable.metadataPath\"")
        metodeVerkPath = config.propertyOrNull("airTable.metodeVerkPath")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"airTable.metodeVerkPath\"")
        allePath = config.propertyOrNull("airTable.allePath")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"airTable.allePath\"")
    }

    // MicrosoftGraph config
    AppConfig.microsoftGraph = MicrosoftGraphConfig.apply {
        baseUrl = config.propertyOrNull("microsoftGraph.baseUrl")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"microsoftGraph.baseUrl\"")
        memberOfPath = config.propertyOrNull("microsoftGraph.memberOfPath")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"microsoftGraph.memberOfPath\"")
    }

    // OAuth config
    AppConfig.oAuth = OAuthConfig.apply {
        issuer = config.propertyOrNull("oAuth.issuer")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"oAuth.issuer\"")
        authUrl = config.propertyOrNull("oAuth.authUrl")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"oAuth.authUrl\"")
        tokenUrl = config.propertyOrNull("oAuth.tokenUrl")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"oAuth.tokenUrl\"")
        jwksUri = config.propertyOrNull("oAuth.jwksUri")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"oAuth.jwksUri\"")
        clientId = config.propertyOrNull("oAuth.clientId")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"oAuth.clientId\"")
        clientSecret = config.propertyOrNull("oAuth.clientSecret")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"oAuth.clientSecret\"")
        providerUrl = config.propertyOrNull("oAuth.providerUrl")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"oAuth.providerUrl\"")
    }

    // Frontend config
    AppConfig.frontend = FrontendConfig.apply {
        host = config.propertyOrNull("frontend.host")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"frontend.host\"")
    }

    // Db config
    AppConfig.db = DbConfig.apply {
        url = config.propertyOrNull("db.url")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"db.url\"")
        username = config.propertyOrNull("db.username")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"db.username\"")
        password = config.propertyOrNull("db.password")?.getString() ?: throw IllegalStateException("Unable to initialize app config \"db.password\"")
    }
}

fun Application.module() {
    loadAppConfig(environment.config)
    install(ContentNegotiation) {
        json()
    }
    configureCors()
    runFlywayMigration()
    installSessions()
    initializeAuthentication()
    configureRouting()
}
