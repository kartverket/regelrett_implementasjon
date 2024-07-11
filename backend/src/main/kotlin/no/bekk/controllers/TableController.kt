package no.bekk.controllers

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import no.bekk.domain.mapToQuestion
import no.bekk.services.AirTableService
import no.bekk.model.internal.*
import no.bekk.plugins.databaseRepository


fun Route.tableRouting() {
    val tableController = TableController()
    route("/airtable") {
        get("/{tableId}") {
            val tableId = call.parameters["tableId"] ?: throw IllegalArgumentException("TableId is required")
            val team = call.request.queryParameters["team"]
            val table = tableController.getTableFromAirTable(tableId, team)
            call.respond(table)
        }
    }
}

class TableController {
    private val airTableService = AirTableService()
    suspend fun getTableFromAirTable(tableId: String, team: String?): Table {
        val metodeverkData = airTableService.fetchDataFromMetodeverk()
        val airTableMetada = airTableService.fetchDataFromMetadata()

        val answers = team?.let {
            databaseRepository.getAnswersByTeamIdFromDatabase(team)
        } ?: run {
            databaseRepository.getAnswersFromDatabase()
        }
        val comments = team?.let {
            databaseRepository.getCommentsByTeamIdFromDatabase(it)
        }

        val tableMetadata = airTableMetada.tables.first { it.id == tableId }
        if (tableMetadata.fields == null) {
            throw IllegalArgumentException("Table $tableId has no fields")
        }

        val questions = metodeverkData.records.map { record ->
            record.mapToQuestion(
                answers = answers.filter { it.questionId == record.fields.jsonObject["ID"]?.jsonPrimitive?.content},
                comments = comments?.filter { it.questionId == record.fields.jsonObject["ID"]?.jsonPrimitive?.content },
                metadataFields = tableMetadata.fields,
            )
        }
        return Table(
            id = tableMetadata.id,
            name = tableMetadata.name,
            records = questions
        )
    }
}