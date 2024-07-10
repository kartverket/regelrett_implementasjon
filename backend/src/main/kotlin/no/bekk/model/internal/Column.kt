package no.bekk.model.internal

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement

@Serializable
data class Column (
    val key: String,
    val value: JsonElement
)
