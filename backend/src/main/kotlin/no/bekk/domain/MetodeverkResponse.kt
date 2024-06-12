package no.bekk.domain

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement

@Serializable
data class AirtableResponse(
    val records: List<JsonElement>,
    val offset: String? = null
)