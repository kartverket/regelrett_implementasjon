package no.bekk.model.internal

import kotlinx.serialization.Serializable

@Serializable
data class Comment(
    val actor: String,
    val questionId: String,
    val comment: String,
    val team: String?,
    val updated: String
)
