package no.bekk.routes

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.controllers.TableController

fun Route.tableRouting() {
    val tableController = TableController()
    route("/airtable") {
        get("/{tableId}/{team}") {
            val tableId = call.parameters["tableId"] ?: throw IllegalArgumentException("TableId is required")
            val team = call.request.queryParameters["team"]
            val table = tableController.getTableFromAirTable(tableId, team)
            call.respond(table)
        }
    }
}