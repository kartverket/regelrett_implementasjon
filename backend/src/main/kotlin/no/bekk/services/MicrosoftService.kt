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
import no.bekk.domain.MicrosoftGraphGroupDisplayNameResponse
import no.bekk.domain.MicrosoftOnBehalfOfTokenResponse
import no.bekk.graphApiMemberOfAddress
import no.bekk.singletons.Env

class MicrosoftService {

    val json = Json { ignoreUnknownKeys = true }

    val client = HttpClient(CIO)

    suspend fun requestTokenOnBehalfOf(userSession: UserSession?): String {
        val response: HttpResponse = userSession?.let {
            client.post("https://login.microsoftonline.com/${Env.get("TENANT_ID")}/oauth2/v2.0/token") {
                contentType(ContentType.Application.FormUrlEncoded)
                setBody(
                    FormDataContent(
                        Parameters.build {
                            append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
                            append("client_id", Env.get("AUTH_CLIENT_ID"))
                            append("client_secret", Env.get("AUTH_CLIENT_SECRET"))
                            append("assertion", it.token)
                            append("scope", "Group.Read.All")
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

    suspend fun fetchGroupNames(bearerToken: String): List<String> {
        // The relevant groups from Entra ID have a known prefix.
        val urlEncodedKnownGroupPrefix = "AAD - TF - TEAM - ".encodeURLPath()
        val url = "$graphApiMemberOfAddress?\$count=true&\$select=displayName&\$filter=startswith(displayName,'$urlEncodedKnownGroupPrefix')"

        val response: HttpResponse = client.get(url) {
            bearerAuth(bearerToken)
            header("ConsistencyLevel", "eventual")
        }
        val responseBody = response.body<String>()
        val microsoftGraphGroupDisplayNameResponse: MicrosoftGraphGroupDisplayNameResponse = json.decodeFromString(responseBody)
        return microsoftGraphGroupDisplayNameResponse.value.map { it.displayName.split("TEAM - ").last() }
    }
}