package no.bekk.domain

import kotlinx.serialization.Serializable

@Serializable
data class MicrosoftGraphGroupsResponse(
    val value: List<MicrosoftGraphGroup>
)

@Serializable
data class MicrosoftGraphGroup(
    val id: String,
    val displayName: String,
)
