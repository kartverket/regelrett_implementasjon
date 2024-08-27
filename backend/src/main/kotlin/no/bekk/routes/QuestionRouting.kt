package no.bekk.routes

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.services.QuestionService

fun Route.questionRouting() {
    val questionService = QuestionService()
    route("/questions") {
        get {
            val questions = questionService.getTestQuestions()
            call.respond(questions)
        }
    }
}