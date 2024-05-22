package no.bekk.domain

import kotlinx.serialization.Serializable

@Serializable
data class MetodeverkResponse(
    val records: List<Record>
)

@Serializable
data class Record(
    val id: String,
    val createdTime: String,
    val fields: Fields
)

@Serializable
data class Fields(
    val Kortnavn: String,
    val Pri: String? = null,
    val Løpenummer: Int,
    val Ledetid: String? = null,
    val Aktivitiet: String? = null,
    val Område: String,
    val Hvem: List<String>? = null,
    val Kode: String,
    val ID: String
)