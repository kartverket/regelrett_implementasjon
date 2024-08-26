package no.bekk.services

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import no.bekk.model.internal.Question
import java.io.File

class QuestionService {

    private val testFile = File("resources/testQuestions.json")
    private val testQuestions = testFile.readText()

    fun getTestQuestions(): List<Question> {
        val typeToken = object : TypeToken<List<Question>>() {}.type
        val questions = Gson().fromJson<List<Question>>(testQuestions, typeToken)
        return questions
    }
}