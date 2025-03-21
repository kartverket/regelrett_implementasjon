package no.bekk.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.configuration.Database
import no.bekk.database.AnswerRepository
import no.bekk.database.CommentRepository
import no.bekk.database.ContextRepository
import no.bekk.routes.*
import no.bekk.services.AuthService
import no.bekk.services.FormService

fun Application.configureRouting(
    formService: FormService,
    database: Database,
    answerRepository: AnswerRepository,
    commentRepository: CommentRepository,
    contextRepository: ContextRepository,
    authService: AuthService
) {
    routing {
        get("/") {
            call.respondText("Velkommen til Kartverket regelrett!")
        }

        get("/health") {
            call.respondText("Health OK", ContentType.Text.Plain)
        }

        get("/schemas") {
            val schemas = formService.getFormProviders().map {
                it.getSchema()
            }
            call.respond(schemas)
        }

        authenticate("auth-jwt") {
            answerRouting(authService, answerRepository)
            commentRouting(authService, commentRepository)
            contextRouting(authService, answerRepository, contextRepository)
            formRouting(formService)
            userInfoRouting(authService)
            uploadCSVRouting(authService, database)
        }

        airTableWebhookRouting(formService)
    }
}
