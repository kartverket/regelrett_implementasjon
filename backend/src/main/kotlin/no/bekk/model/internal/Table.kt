package no.bekk.model.internal

import kotlinx.serialization.Serializable

@Serializable
data class Table(
    val id: String,
    val name: String,
    val records: List<Question>,
)
