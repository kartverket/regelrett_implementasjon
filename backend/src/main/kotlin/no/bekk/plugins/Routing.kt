package no.bekk.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.encodeToJsonElement
import no.bekk.SLAController

val slaController = SLAController()

fun Application.configureRouting() {
    routing {
        get("/") {
            call.respondText("Velkommen til Kartverket Kontrollere!")
        }
    }
    routing {
        get("/metodeverk") {
            val data = slaController.fetchDataFromMetodeverk()
            val jsonData = Json.encodeToJsonElement(data)
            call.respondText(jsonData.toString(), contentType = ContentType.Application.Json)
        }

    }

    routing {
        get("/alle") {
            val data = slaController.fetchDataFromAlle()
            call.respondText(data.records.toString())
        }

    }
}
