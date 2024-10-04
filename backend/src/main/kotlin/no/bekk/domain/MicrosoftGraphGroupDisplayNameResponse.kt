package no.bekk.domain

import kotlinx.serialization.Serializable

@Serializable
data class MicrosoftGraphGroupIdAndDisplayNameResponse(
    val value: List<MicrosoftGraphGroupIdAndDisplayName>
)

@Serializable
data class MicrosoftGraphGroupIdAndDisplayName(
    val id: String,
    val displayName: String
)
