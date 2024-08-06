package no.bekk.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.routes.*

fun Application.configureRouting() {

    routing {
        alleRouting()
        answerRouting()
        commentRouting()
        kontrollereRouting()
        metodeverkRouting()
        questionRouting()
        tableRouting()
    }

    routing {
        get("/") {
            call.respondText("Velkommen til Kartverket Kontrollere!")
        }
    }

    routing {
        get("/health") {
            call.respondText("Health OK", ContentType.Text.Plain)
        }
    }
}
