package no.bekk.domain

import kotlinx.serialization.Serializable

@Serializable
data class MicrosoftGraphGroupDisplayNameResponse(
    val value: List<MicrosoftGraphGroupDisplayName>
)

@Serializable
data class MicrosoftGraphGroupDisplayName(
    val displayName: String,
)
