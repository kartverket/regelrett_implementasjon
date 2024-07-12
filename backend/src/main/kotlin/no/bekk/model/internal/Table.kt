package no.bekk.model.internal

import kotlinx.serialization.Serializable

@Serializable
data class Field(
    val type: OptionalFieldType,
    val name: String,
    val options: List<String>?
)

@Serializable
data class Table(
    val id: String,
    val name: String,
    val columns: List<Field>,
    val records: List<Question>,
)
