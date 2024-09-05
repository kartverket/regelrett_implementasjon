package no.bekk.model.internal

import kotlinx.serialization.Serializable

@Serializable
data class Option(
    val name: String,
    val color: String? = null,
)

@Serializable
data class Field(
    val type: OptionalFieldType,
    val name: String,
    val options: List<Option>?
)

@Serializable
data class Table(
    val id: String,
    val name: String,
    val fields: List<Field>,
    val records: List<Question>,
)
