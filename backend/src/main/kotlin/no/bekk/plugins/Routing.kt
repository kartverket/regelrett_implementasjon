package no.bekk.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.encodeToJsonElement
import no.bekk.AirTableController
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.buildJsonObject
import no.bekk.domain.MetadataResponse
import no.bekk.domain.MetodeverkResponse

val slaController = AirTableController()

fun Application.configureRouting() {

    @Serializable
    data class CombinedData(
        val metodeverkData: JsonElement,
        val metaData: JsonElement
    )

    routing {
        get("/") {
            call.respondText("Velkommen til Kartverket Kontrollere!")
        }
    }
    routing {
        get("/metodeverk") {
            val data = slaController.fetchDataFromMetodeverk()
            val meta = slaController.fetchDataFromMetadata()
            val metodeverkData = Json.encodeToJsonElement(data)
            val metaData = Json.encodeToJsonElement(meta)
            val combinedData = CombinedData(metodeverkData, metaData)
            val combinedJson = Json.encodeToString(combinedData)
            call.respondText(combinedJson, contentType = ContentType.Application.Json)
        }

    }

    routing {
        get("/alle") {
            val data = slaController.fetchDataFromAlle()
            call.respondText(data.records.toString())
        }

    }


}

fun combineDataAndMetadata(data: MetodeverkResponse, metadata: MetadataResponse): JsonElement {
    return buildJsonObject {
        put("data", Json.encodeToJsonElement(data))
        put("metadata", Json.encodeToJsonElement(metadata))
    }
}
