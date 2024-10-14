package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import no.bekk.authentication.hasFunctionAccess
import no.bekk.authentication.hasTeamAccess
import no.bekk.database.AnswerRepository
import no.bekk.database.DatabaseAnswer
import no.bekk.database.DatabaseAnswerRequest
import no.bekk.services.FriskService
import no.bekk.util.logger

fun Route.answerRouting() {
    val answerRepository = AnswerRepository()
    val friskService = FriskService()

    post("/answer") {
        val answerRequestJson = call.receiveText()
        logger.debug("Received POST /answer request with body: $answerRequestJson")
        val answerRequest = Json.decodeFromString<DatabaseAnswerRequest>(answerRequestJson)

        if (answerRequest.team != null && answerRequest.functionId != null && answerRequest.contextId != null) {
            call.respond(HttpStatusCode.BadRequest)
            return@post
        }

        if (answerRequest.functionId != null) {
            if (!hasFunctionAccess(call, friskService, answerRequest.functionId)) {
                call.respond(HttpStatusCode.Forbidden)
                return@post
            }
        } else if (answerRequest.team != null) {
            if(!hasTeamAccess(call, answerRequest.team)){
                call.respond(HttpStatusCode.Unauthorized)
                return@post
            }
        } else if (answerRequest.contextId == null) {
            call.respond(HttpStatusCode.BadRequest)
            return@post
        }

        val insertedAnswer: DatabaseAnswer
        if (answerRequest.functionId != null) {
            insertedAnswer = answerRepository.insertAnswerOnFunction(answerRequest)
        } else if (answerRequest.team != null) {
            insertedAnswer = answerRepository.insertAnswerOnTeam(answerRequest)
        } else {
            insertedAnswer = answerRepository.insertAnswerOnContext(answerRequest)
        }
        call.respond(HttpStatusCode.OK, Json.encodeToString(insertedAnswer))
    }

    get("/answers") {
        val teamId = call.request.queryParameters["teamId"]
        val functionId = call.request.queryParameters["functionId"]?.toIntOrNull()
        val recordId = call.request.queryParameters["recordId"]
        val tableId = call.request.queryParameters["tableId"]
        val contextId = call.request.queryParameters["contextId"]


        if (functionId != null && teamId != null && contextId != null) {
            call.respond(HttpStatusCode.BadRequest)
            return@get
        }

        if (functionId != null) {
            if (!hasFunctionAccess(call, friskService, functionId)){
                call.respond(HttpStatusCode.Forbidden)
                return@get
            }
        } else if (teamId != null) {
            if (!hasTeamAccess(call, teamId)){
                call.respond(HttpStatusCode.Forbidden)
                return@get
            }
        }

        var answers: MutableList<DatabaseAnswer>

        if (teamId != null) {
            if (recordId != null && tableId != null){
                answers = answerRepository.getAnswersByTeamAndRecordIdFromDatabase(teamId, tableId, recordId)
            } else {
                answers = answerRepository.getAnswersByTeamIdFromDatabase(teamId)
            }
        } else if (functionId != null){
            if (recordId != null && tableId != null){
                answers = answerRepository.getAnswersByFunctionAndRecordIdFromDatabase(functionId, tableId, recordId)
            } else {
                answers = answerRepository.getAnswersByFunctionIdFromDatabase(functionId)
            }
        } else if (contextId != null) {
            if (recordId != null) {
                answers = answerRepository.getAnswersByContextAndRecordIdFromDatabase(contextId, recordId)
            } else {
                answers = answerRepository.getAnswersByContextIdFromDatabase(contextId)
            }
        } else {
            call.respond(HttpStatusCode.BadRequest)
            return@get
        }
        val answersJson = Json.encodeToString(answers)
        call.respondText(answersJson, contentType = ContentType.Application.Json)
    }

}