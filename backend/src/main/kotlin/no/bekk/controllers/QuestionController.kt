package no.bekk.controllers

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.model.internal.Question
import java.io.File

fun Route.questionRouting() {
    val questionController = QuestionController()
    route("/questions") {
        get {
            val questions = questionController.getTestQuestions()
            call.respond(questions)
        }
    }
}

class QuestionController {

    private val testFile = File("resources/testQuestions.json")
    private val testQuestions = testFile.readText()

    fun getTestQuestions(): List<Question> {
        val typeToken = object : TypeToken<List<Question>>() {}.type
        val questions = Gson().fromJson<List<Question>>(testQuestions, typeToken)
        return questions
    }
}