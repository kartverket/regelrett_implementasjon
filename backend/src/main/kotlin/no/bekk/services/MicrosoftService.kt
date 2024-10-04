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
import no.bekk.configuration.getTokenUrl
import no.bekk.domain.MicrosoftGraphGroupIdAndDisplayName
import no.bekk.domain.MicrosoftGraphGroupIdAndDisplayNameResponse
import no.bekk.domain.MicrosoftOnBehalfOfTokenResponse
import no.bekk.util.logger

class MicrosoftService {

    val json = Json { ignoreUnknownKeys = true }

    val client = HttpClient(CIO)

    suspend fun requestTokenOnBehalfOf(userSession: UserSession?): String {
        val response: HttpResponse = userSession?.let {
            client.post(AppConfig.oAuth.getTokenUrl()) {
                contentType(ContentType.Application.FormUrlEncoded)
                setBody(
                    FormDataContent(
                        Parameters.build {
                            append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
                            append("client_id", AppConfig.oAuth.clientId)
                            append("client_secret", AppConfig.oAuth.clientSecret)
                            append("assertion", it.token)
                            append("scope", "GroupMember.Read.All")
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

    suspend fun requestFRISKTokenOnBehalfOf(userSession: UserSession?): String {
        val response: HttpResponse = userSession?.let {
            client.post("https://login.microsoftonline.com/7531b79e-fd42-4826-bff2-131d82c7b557/oauth2/v2.0/token") {
                contentType(ContentType.Application.FormUrlEncoded)
                setBody(
                    FormDataContent(
                        Parameters.build {
                            append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
                            append("client_id", AppConfig.oAuth.clientId)
                            append("client_secret", AppConfig.oAuth.clientSecret)
                            append("assertion", it.token)
                            append("scope", "3e09bdb6-734c-473e-ab69-1238057dfc5d" + "/.default")
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

    suspend fun fetchGroupsWithIdAndNames(bearerToken: String): List<MicrosoftGraphGroupIdAndDisplayName> {
        val urlEncodedKnownGroupPrefix = "AAD - TF - TEAM - ".encodeURLPath()
        val url =
            "${AppConfig.microsoftGraph.baseUrl + AppConfig.microsoftGraph.memberOfPath}?\$count=true&\$select=id,displayName&\$filter=startswith(displayName,'$urlEncodedKnownGroupPrefix')"

        val response: HttpResponse = client.get(url) {
            bearerAuth(bearerToken)
            header("ConsistencyLevel", "eventual")
        }
        val responseBody = response.body<String>()
        val microsoftGraphGroupIdAndDisplayNameResponse: MicrosoftGraphGroupIdAndDisplayNameResponse =
            json.decodeFromString(responseBody)
        return microsoftGraphGroupIdAndDisplayNameResponse.value.map { MicrosoftGraphGroupIdAndDisplayName(
            id = it.id,
            displayName = it.displayName.split("TEAM - ").last(),
        ) }
    }

    suspend fun fetchFunkRegMetadata(accessToken: String, teamId: String): Any {
        val funkRegEndpoint = "http://localhost:8080/metadata"

        try {
            val response: HttpResponse = client.get(funkRegEndpoint) {
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
            return responseBody
        } catch (ex: Exception) {
            logger.error("Exception while fetching resource from FunkReg: ${ex.message}")
            throw ex
        }
    }
    suspend fun fetchFunkRegFunction(accessToken: String, functionId: Int): Any {
        val funkRegEndpoint = "http://localhost:8080/functions/$functionId"

        try {
            val response: HttpResponse = client.get(funkRegEndpoint) {
                bearerAuth(accessToken)
                accept(ContentType.Application.Json)
            }

            if (response.status != HttpStatusCode.OK) {
                val errorBody = response.bodyAsText()
                logger.error("FunkReg request failed with status ${response.status}: $errorBody")
                throw Exception("Failed to retrieve resource from FunkReg")
            }

            val responseBody = response.body<String>()
            return responseBody
        } catch (ex: Exception) {
            logger.error("Exception while fetching resource from FunkReg: ${ex.message}")
            throw ex
        }
    }
}
