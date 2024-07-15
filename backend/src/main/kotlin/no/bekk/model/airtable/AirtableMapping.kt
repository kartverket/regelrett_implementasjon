package no.bekk.model.airtable

import no.bekk.model.internal.AnswerType
import no.bekk.model.internal.OptionalFieldType

enum class AirTableFieldType(val fieldType: String) {
    FORMULA("formula"),
    MULTIPLE_SELECTS("multipleSelects"),
    SINGLE_SELECT("singleSelect"),
    MULTILINE_TEXT("multilineText"),
    SINGLE_LINE_TEXT("singleLineText"),
    UNKNOWN("unknown");

    companion object {
        fun fromString(fieldType: String): AirTableFieldType {
            return entries.find { it.fieldType == fieldType } ?: UNKNOWN
        }
    }
}

fun mapAirTableFieldTypeToAnswerType(airtableFieldType: AirTableFieldType): AnswerType {
    return when (airtableFieldType) {
        AirTableFieldType.MULTIPLE_SELECTS -> AnswerType.SELECT_MULTIPLE
        AirTableFieldType.SINGLE_SELECT-> AnswerType.SELECT_SINGLE
        AirTableFieldType.MULTILINE_TEXT -> AnswerType.TEXT_MULTI_LINE
        AirTableFieldType.SINGLE_LINE_TEXT -> AnswerType.TEXT_SINGLE_LINE
        else -> throw IllegalArgumentException("Unknown field type: $airtableFieldType")
    }
}

fun mapAirTableFieldTypeToOptionalFieldType(airtableFieldType: AirTableFieldType): OptionalFieldType {
    return when (airtableFieldType) {
        AirTableFieldType.FORMULA -> OptionalFieldType.TEXT
        AirTableFieldType.MULTIPLE_SELECTS -> OptionalFieldType.OPTION_MULTIPLE
        AirTableFieldType.SINGLE_SELECT -> OptionalFieldType.OPTION_SINGLE
        AirTableFieldType.MULTILINE_TEXT -> OptionalFieldType.TEXT
        AirTableFieldType.SINGLE_LINE_TEXT -> OptionalFieldType.TEXT
        else -> throw IllegalArgumentException("Unknown field type: $airtableFieldType")
    }
}