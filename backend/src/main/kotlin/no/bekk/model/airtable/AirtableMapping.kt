package no.bekk.model.airtable

import no.bekk.model.internal.AnswerType
import no.bekk.model.internal.OptionalFieldType

fun mapAirTableFieldTypeToAnswerType(airtableFieldType: String): AnswerType {
    return when (airtableFieldType) {
        "formula" -> AnswerType.TEXT_SINGLE_LINE
        "multipleSelects" -> AnswerType.SELECT_MULTIPLE
        "singleSelect" -> AnswerType.SELECT_SINGLE
        "multilineText" -> AnswerType.TEXT_MULTI_LINE
        "singleLineText" -> AnswerType.TEXT_SINGLE_LINE
        else -> throw IllegalArgumentException("Unknown field type: $airtableFieldType")
    }
}

fun mapAirTableFieldTypeToOptionalFieldType(airtableFieldType: String): OptionalFieldType {
    return when (airtableFieldType) {
        "formula" -> OptionalFieldType.TEXT
        "multipleSelects" -> OptionalFieldType.OPTION_MULTIPLE
        "singleSelect" -> OptionalFieldType.OPTION_SINGLE
        "multilineText" -> OptionalFieldType.TEXT
        "singleLineText" -> OptionalFieldType.TEXT
        else -> throw IllegalArgumentException("Unknown field type: $airtableFieldType")
    }
}