package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.services.TableService

fun Route.tableRouting() {
    val tableService = TableService()
    route("/table") {
        get("/{tableId}") {
            val tableId = call.parameters["tableId"]
            if (tableId == null) {
                call.respond(HttpStatusCode.BadRequest,"TableId is missing")
                return@get
            }
            val team = call.request.queryParameters["team"]
            try {
                val table = tableService.getTable(tableId, team)
                call.respond(table)
            } catch (e: IllegalArgumentException) {
                call.respond(HttpStatusCode.InternalServerError, "An error occured: ${e.message}")
            }
        }
    }
}