package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.encodeToJsonElement
import no.bekk.domain.CombinedData
import no.bekk.services.AirTableService

fun Route.metodeverkRouting() {

    val airTableService = AirTableService()

    get("/metodeverk") {
        val data = airTableService.fetchDataFromMetodeverk()
        val meta = airTableService.fetchDataFromMetadata()
        val metodeverkData = Json.encodeToJsonElement(data)
        val metaData = Json.encodeToJsonElement(meta)
        val combinedData = CombinedData(metodeverkData, metaData)
        val combinedJson = Json.encodeToString(combinedData)
        call.respondText(combinedJson, contentType = ContentType.Application.Json)
    }
}