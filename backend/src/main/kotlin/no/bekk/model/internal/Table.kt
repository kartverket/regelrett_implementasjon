package no.bekk.model.internal

import kotlinx.serialization.Serializable
import no.bekk.domain.Field

@Serializable
data class Table(
    val id: String,
    val name: String,
    val fields: List<Field>,
    val records: List<Question>,
)
