package no.bekk.domain

import kotlinx.serialization.Serializable

@Serializable
data class FriskMetadataResponse(
    val id: Int,
    val functionId: Int,
    val key: String,
    val value: String,
)

@Serializable
data class FriskFunctionResponse(
    val id: Int,
    val parentId: Int,
    val path: String,
    val name: String,
    val description: String,
)