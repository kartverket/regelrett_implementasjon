package no.bekk.database

import kotlinx.serialization.Serializable

@Serializable
data class DatabaseComment(
    val actor: String,
    val recordId: String,
    val questionId: String,
    val comment: String,
    val team: String? = null,
    val functionId: Int? = null,
    val updated: String,
    val contextId: String? = null
)

@Serializable
data class DatabaseCommentRequest(
    val actor: String,
    val recordId: String,
    val questionId: String,
    val comment: String,
    val team: String? = null,
    val functionId: Int? = null,
    val contextId: String? = null
)
