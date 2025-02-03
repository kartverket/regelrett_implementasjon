package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.services.FormService
import no.bekk.util.logger

fun Route.formRouting() {
    route("/forms") {
        get {
            val tables = FormService.getFormProviders().map {
                it.getForm()
            }
            call.respond(tables)
        }
        get("/{formId}") {
            val formId = call.parameters["formId"]
            if (formId == null) {
                logger.warn("Request missing tableId")
                call.respond(HttpStatusCode.BadRequest,"FormId is missing")
                return@get
            }

            try {
                val table = FormService.getFormProvider(formId).getForm()
                call.respond(table)
            } catch (e: IllegalArgumentException) {
                logger.error("Error occurred while retrieving table for formId: $formId", e)
                call.respond(HttpStatusCode.InternalServerError, "An error occured: ${e.message}")
            }
        }
        get("/{formId}/{recordId}") {
            val formId = call.parameters["formId"]
            val recordId = call.parameters["recordId"]
            if (formId == null || recordId == null) {
                logger.warn("Request missing tableId or recordId")
                call.respond(HttpStatusCode.BadRequest,"FormId is missing")
                return@get
            }
            try {
                val question = FormService.getFormProvider(formId).getQuestion(recordId)
                logger.info("Successfully retrieved question: $question")
                call.respond(question)
            } catch (e: NotFoundException) {
                logger.error("Question with recordId: $recordId was not found", e)
                call.respond(HttpStatusCode.NotFound, "An error occured: ${e.message}")
            } catch (e: Exception) {
                logger.error("Error occurred while retrieving question for recordId: $recordId", e)
                call.respond(HttpStatusCode.InternalServerError, "An error occured: ${e.message}")
            }
        }
        get("/{formId}/columns") {
            val formId = call.parameters["formId"]
            if (formId == null) {
                logger.warn("Request missing FormId")
                call.respond(HttpStatusCode.BadRequest,"FormId is missing")
                return@get
            }
            try {
                val columns = FormService.getFormProvider(formId).getColumns()
                logger.info("Successfully retrieved columns: $columns")
                call.respond(columns)
            } catch (e: Exception) {
                logger.error("Error occurred while retrieving columns from form: $formId", e)
                call.respond(HttpStatusCode.InternalServerError, "An error occured: ${e.message}")
            }
        }
    }
}