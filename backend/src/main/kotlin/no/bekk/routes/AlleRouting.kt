package no.bekk.routes

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.services.AirTableService

fun Route.alleRouting() {

    val airTableService = AirTableService()

    get("/alle") {
        val data = airTableService.fetchDataFromAlle()
        call.respondText(data.records)
    }
}