package no.bekk.domain

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import no.bekk.model.airtable.AirTableFieldType
import no.bekk.model.airtable.mapAirTableFieldTypeToAnswerType
import no.bekk.model.airtable.mapAirTableFieldTypeToOptionalFieldType
import no.bekk.model.internal.*
import java.util.*

@Serializable
data class AirtableResponse(
    val records: List<Record>,
    val offset: String? = null
)

@Serializable
data class Record(
    val id: String,
    val createdTime: String,
    val fields: JsonElement
)

fun Record.mapToQuestion(
    metaDataFields: List<Field>,
) = Question(
        id = fields.jsonObject["ID"]?.jsonPrimitive?.content ?: UUID.randomUUID().toString(),
        question = fields.jsonObject["Aktivitet"]?.jsonPrimitive?.content ?: "",
        updated = createdTime,
        metadata = QuestionMetadata(
            answerMetadata = AnswerMetadata(
                type = mapAirTableFieldTypeToAnswerType(AirTableFieldType.fromString(metaDataFields.find { it.name == "Svar" }?.type ?: "unknown")),
                options = metaDataFields.find { it.name == "Svar" }?.options?.choices?.map { choice -> choice.name }
            ),
            optionalFields = metaDataFields.filterNot { it.name == "Svar" }.map {
                OptionalField(
                    key = it.name,
                    value = fields.jsonObject[it.name] // is JsonElement, can be JsonArray or JsonPrimitive
                        .let { element ->
                            when (element) {
                                is JsonArray -> element.map { e -> e.jsonPrimitive.content }
                                is JsonElement -> listOf(element.jsonPrimitive.content)
                                else -> listOf()
                            }
                        },
                    type = mapAirTableFieldTypeToOptionalFieldType(AirTableFieldType.fromString(it.type)),
                    options = it.options?.choices?.map { choice -> choice.name },
                )
            }
        )
)