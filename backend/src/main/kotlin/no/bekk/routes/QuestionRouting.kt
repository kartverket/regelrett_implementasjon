package no.bekk.routes

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.controllers.QuestionController

fun Route.questionRouting() {
    val questionController = QuestionController()
    route("/questions") {
        get {
            val questions = questionController.getTestQuestions()
            call.respond(questions)
        }
    }
}