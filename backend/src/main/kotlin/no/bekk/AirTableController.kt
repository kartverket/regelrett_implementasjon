package no.bekk

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
import io.ktor.client.plugins.auth.providers.*
import io.ktor.client.request.*
import io.ktor.client.request.headers
import io.ktor.client.statement.*
import kotlinx.serialization.json.Json
import no.bekk.domain.AlleResponse
import no.bekk.domain.MetodeverkResponse
import no.bekk.domain.MetadataResponse
import no.bekk.domain.Record


class AirTableController {


    val json = Json { ignoreUnknownKeys = true }

    val client = HttpClient(CIO) {
        install(Auth) {
            bearer {
                loadTokens {
                    BearerTokens(accessToken, "")
                }
            }
        }
    }

    suspend fun fetchDataFromMetadata(): MetadataResponse {

        val response: HttpResponse = client.get(metadataAddress)
        val responseBody = response.body<String>()
        val metadataResponse: MetadataResponse = json.decodeFromString(responseBody)
        return metadataResponse

    }

    suspend fun fetchDataFromMetodeverk(): MetodeverkResponse {
        val allRecords = mutableListOf<Record>()
        var offset: String? = null

        do {
            val response = fetchMetodeverkPage(offset)
            allRecords.addAll(response.records)
            offset = response.offset
        } while (offset != null)

        val metodeverkResponse = MetodeverkResponse(allRecords)
        return metodeverkResponse
    }

    private fun filterRecordsById(id: String, metodeverkResponse: MetodeverkResponse): MetodeverkResponse {
        return metodeverkResponse.copy(records = metodeverkResponse.records.filter { it.fields.Hvem?.contains(id) == true })
    }

    suspend fun getTeamDataFromMetodeverk(id: String): MetodeverkResponse {
        val response = fetchDataFromMetodeverk();
        return filterRecordsById(id, response)
    }


    private suspend fun fetchMetodeverkPage(offset: String? = null): MetodeverkResponse {
        val url = buildString {
            append(metodeverkAddress)
            if (offset != null) {
                append("&offset=$offset")
            }
        }
        val response: HttpResponse = client.get(url) {
            headers {
                append("Authorization", "Bearer $accessToken")
            }
        }
        val responseBody = response.bodyAsText()
        return json.decodeFromString(responseBody)
    }

    suspend fun fetchDataFromAlle(): AlleResponse {
        val response: HttpResponse = client.get(alleAddress)
        val responseBody = response.body<String>()
        val alleResponse: AlleResponse = json.decodeFromString(responseBody)
        return alleResponse
    }


}