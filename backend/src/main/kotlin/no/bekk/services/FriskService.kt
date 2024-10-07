package no.bekk.services

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.serialization.json.Json
import no.bekk.authentication.UserSession
import no.bekk.configuration.AppConfig
import no.bekk.domain.*
import no.bekk.domain.MicrosoftOnBehalfOfTokenResponse
import no.bekk.util.logger

class FriskService {

    val json = Json { ignoreUnknownKeys = true }

    val client = HttpClient(CIO)

    suspend fun fetchMetadataByTeamId(userSession: UserSession, teamId: String): FriskMetadataResponse {
        try {
            val accessToken = requestTokenOnBehalfOf(userSession)
            val response: HttpResponse = client.get(AppConfig.FRISK.apiUrl + "/metadata") {
                bearerAuth(accessToken)
                accept(ContentType.Application.Json)
                url {
                    parameters.append("key", "team")
                    parameters.append("value", teamId)
                }
            }

            if (response.status != HttpStatusCode.OK) {
                val errorBody = response.bodyAsText()
                logger.error("FunkReg request failed with status ${response.status}: $errorBody")
                throw Exception("Failed to retrieve resource from FunkReg")
            }

            val responseBody = response.body<String>()
            val metadata = json.decodeFromString<FriskMetadataResponse>(responseBody)
            return metadata
        } catch (ex: Exception) {
            logger.error("Exception while fetching resource from FunkReg: ${ex.message}")
            throw ex
        }
    }

    suspend fun fetchFunctionByFunctionId(userSession: UserSession, functionId: Int): FriskFunctionResponse {
        try {
            val accessToken = requestTokenOnBehalfOf(userSession)
            val response: HttpResponse = client.get(AppConfig.FRISK.apiUrl + "/functions/$functionId") {
                bearerAuth(accessToken)
                accept(ContentType.Application.Json)
            }

            if (response.status != HttpStatusCode.OK) {
                val errorBody = response.bodyAsText()
                logger.error("FunkReg request failed with status ${response.status}: $errorBody")
                throw Exception("Failed to retrieve resource from FunkReg")
            }

            val responseBody = response.body<String>()
            val function = json.decodeFromString<FriskFunctionResponse>(responseBody)
            return function
        } catch (ex: Exception) {
            logger.error("Exception while fetching resource from FunkReg: ${ex.message}")
            throw ex
        }
    }

    private suspend fun requestTokenOnBehalfOf(userSession: UserSession?): String {
        val friskTokenEndpoint = "${AppConfig.oAuth.baseUrl}/${AppConfig.FRISK.tenantId}${AppConfig.oAuth.tokenPath}"
        val response: HttpResponse = userSession?.let {
            client.post(friskTokenEndpoint) {
                contentType(ContentType.Application.FormUrlEncoded)
                setBody(
                    FormDataContent(
                        Parameters.build {
                            append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
                            append("client_id", AppConfig.oAuth.clientId)
                            append("client_secret", AppConfig.oAuth.clientSecret)
                            append("assertion", it.token)
                            append("scope", AppConfig.FRISK.clientId + "/.default")
                            append("requested_token_use", "on_behalf_of")
                        }
                    )
                )
            }
        } ?: throw IllegalStateException("No stored UserSession")

        val responseBody = response.body<String>()
        val microsoftOnBehalfOfTokenResponse: MicrosoftOnBehalfOfTokenResponse = json.decodeFromString(responseBody)
        return microsoftOnBehalfOfTokenResponse.accessToken
    }
}