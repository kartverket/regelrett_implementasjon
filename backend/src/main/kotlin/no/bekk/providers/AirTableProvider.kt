package no.bekk.providers

import kotlinx.serialization.json.*
import no.bekk.domain.AirtableResponse
import no.bekk.domain.MetadataResponse
import no.bekk.domain.Record
import no.bekk.domain.mapToQuestion
import no.bekk.model.airtable.AirTableFieldType
import no.bekk.model.airtable.mapAirTableFieldTypeToAnswerType
import no.bekk.model.airtable.mapAirTableFieldTypeToOptionalFieldType
import no.bekk.model.internal.Column
import no.bekk.model.internal.Option
import no.bekk.model.internal.Question
import no.bekk.model.internal.Table
import no.bekk.providers.clients.AirTableClient
import no.bekk.util.logger

class AirTableProvider(
    override val id: String,
    private val airtableClient: AirTableClient,
    private val baseId: String,
    private val tableId: String,
    private val viewId: String? = null
) : TableProvider {

    val json = Json { ignoreUnknownKeys = true }

    override suspend fun getTable(): Table {
        return getTableFromAirTable()
    }

    override suspend fun getQuestion(recordId: String): Question {
        return getQuestionFromAirtable(recordId)
    }

    override suspend fun getColumns(): List<Column> {
        return getColumnsFromAirTable()
    }

    private suspend fun getTableFromAirTable(): Table {
        val metodeverkData = fetchDataFromMetodeverk()
        val airTableMetadata = fetchDataFromMetadata()

        val tableMetadata = airTableMetadata.tables.first { it.id == tableId }
        if (tableMetadata.fields == null) {
            throw IllegalArgumentException("Table $tableId has no fields")
        }

        val questions = metodeverkData.records.mapNotNull { record ->
            logger.info("ERROR VALUE: {}", record.fields.jsonObject["Svartype"]?.jsonPrimitive?.content)
            if (record.fields.jsonObject["Svartype"]?.jsonPrimitive?.content == null) {
                null
            } else {
                record.mapToQuestion(
                    recordId = record.id,
                    metaDataFields = tableMetadata.fields,
                    answerType = mapAirTableFieldTypeToAnswerType(
                        AirTableFieldType.fromString(
                            record.fields.jsonObject["Svartype"]?.jsonPrimitive?.content ?: "unknown"
                        )
                    ),
                    answerOptions = record.fields.jsonObject["Svar"]?.jsonArray?.map { it.jsonPrimitive.content }
                )
            }
        }

        val columns = tableMetadata.fields.mapNotNull { field ->
            if (field.type == "multipleRecordLinks") {
                null
            } else {
                Column(
                    type = mapAirTableFieldTypeToOptionalFieldType(AirTableFieldType.fromString(field.type)),
                    name = field.name,
                    options = field.options?.choices?.map { choice ->
                        Option(name = choice.name, color = choice.color)
                    }
                )
            }
        }

        return Table(
            id = id,
            name = tableMetadata.name,
            columns = columns,
            records = questions
        )
    }

    private suspend fun getQuestionFromAirtable(recordId: String): Question {
        val record = fetchRecord(recordId)
        val airTableMetadata = fetchDataFromMetadata()

        val tableMetadata = airTableMetadata.tables.first { it.id == tableId }
        if (tableMetadata.fields == null) {
            throw IllegalArgumentException("Table $tableId has no fields")
        }

        val question = record.mapToQuestion(
            recordId = record.id,
            metaDataFields = tableMetadata.fields,
            answerType = mapAirTableFieldTypeToAnswerType(
                AirTableFieldType.fromString(
                    record.fields.jsonObject["Svartype"]?.jsonPrimitive?.content ?: "unknown"
                )
            ),
            answerOptions = record.fields.jsonObject["Svar"]?.jsonArray?.map { it.jsonPrimitive.content })

        return question
    }

    private suspend fun getColumnsFromAirTable(): List<Column> {
        val airTableMetadata = fetchDataFromMetadata()

        val tableMetadata = airTableMetadata.tables.first { it.id == tableId }
        if (tableMetadata.fields == null) {
            throw IllegalArgumentException("Table $tableId has no fields")
        }
        return tableMetadata.fields.map { field ->
            Column(
                type = mapAirTableFieldTypeToOptionalFieldType(AirTableFieldType.fromString(field.type)),
                name = field.name,
                options = field.options?.choices?.map { choice ->
                    Option(name = choice.name, color = choice.color)
                }
            )
        }
    }

    private fun filterDataOnStop(metadataResponse: MetadataResponse): MetadataResponse {
        val newTables = metadataResponse.tables.map { table ->
            val fields = table.fields
            if (!fields.isNullOrEmpty()) {
                val stopIndex = fields.indexOfFirst { it.name == "STOP" }
                if (stopIndex != -1) {
                    val newFields = fields.slice(0..<stopIndex)
                    table.copy(fields = newFields)
                } else {
                    table
                }
            } else {
                table
            }
        }

        return metadataResponse.copy(tables = newTables)
    }

    private suspend fun fetchDataFromMetadata(): MetadataResponse {
        val metadataResponse = airtableClient.getBaseSchema(baseId)
        val filteredMetaData = filterDataOnStop(metadataResponse = metadataResponse)
        return filteredMetaData

    }

    suspend fun fetchDataFromMetodeverk(): AirtableResponse {
        var offset: String? = null
        val allRecords = mutableListOf<Record>()
        do {
            val response = fetchMetodeverkPage(offset)
            val records = response.records
            allRecords.addAll(records)
            offset = response.offset
        } while (offset != null)

        return AirtableResponse(allRecords)
    }

    private suspend fun fetchMetodeverkPage(offset: String? = null): AirtableResponse {
        return airtableClient.getRecords(baseId, tableId, viewId, offset)
    }

    private suspend fun fetchRecord(recordId: String): Record {
        return airtableClient.getRecord(baseId, tableId, recordId)
    }
}