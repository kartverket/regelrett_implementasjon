package no.bekk.domain

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class MicrosoftOnBehalfOfTokenResponse(
    @SerialName("token_type") val tokenType: String,
    @SerialName("scope") val scope: String,
    @SerialName("expires_in") val expiresIn: Int,
    @SerialName("ext_expires_in") val extExpiresIn: Int,
    @SerialName("access_token") val accessToken: String,
)
