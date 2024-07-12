package no.bekk.controllers

import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import no.bekk.domain.mapToQuestion
import no.bekk.model.airtable.AirTableFieldType
import no.bekk.model.airtable.mapAirTableFieldTypeToOptionalFieldType
import no.bekk.services.AirTableService
import no.bekk.model.internal.*
import no.bekk.plugins.databaseRepository

class TableController {
    private val airTableService = AirTableService()

    private fun getAnswers(team: String?) = team?.let {
        databaseRepository.getAnswersByTeamIdFromDatabase(team)
    } ?: run {
        databaseRepository.getAnswersFromDatabase()
    }

    private fun getComments(team: String?) = team?.let {
        databaseRepository.getCommentsByTeamIdFromDatabase(it)
    } ?: mutableListOf()

    suspend fun getTableFromAirTable(tableId: String, team: String?): Table {
        val metodeverkData = airTableService.fetchDataFromMetodeverk()
        val airTableMetadata = airTableService.fetchDataFromMetadata()

        val tableMetadata = airTableMetadata.tables.first { it.id == tableId }
        if (tableMetadata.fields == null) {
            throw IllegalArgumentException("Table $tableId has no fields")
        }

        val answers = getAnswers(team)
        val comments = getComments(team)

        val questions = metodeverkData.records.map { record ->
            record.mapToQuestion(
                answers = answers.filter { it.questionId == record.fields.jsonObject["ID"]?.jsonPrimitive?.content},
                comments = comments.filter { it.questionId == record.fields.jsonObject["ID"]?.jsonPrimitive?.content },
                metaDataFields = tableMetadata.fields,
            )
        }

        val fields = tableMetadata.fields.map { field ->
            Field(
                type = mapAirTableFieldTypeToOptionalFieldType(AirTableFieldType.fromString(field.type)),
                name = field.name,
                options = field.options?.choices?.map { choice -> choice.name }
            )
        }

        return Table(
            id = tableMetadata.id,
            name = tableMetadata.name,
            fields = fields,
            records = questions
        )
    }
}