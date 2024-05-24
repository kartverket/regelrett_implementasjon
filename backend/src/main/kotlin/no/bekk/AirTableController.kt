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

private val accessToken = "patPdLroD158pgYMv.2b2593a9ea608c34c5197c15f8c5d20e2cf362b369fd48d637763e078981a04f"

class AirTableController {

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

        val response: HttpResponse = client.get("https://api.airtable.com/v0/meta/bases/appzJQ8Tkmm8DobrJ/tables")
        val responseBody = response.body<String>()
        val metadataResponse: MetadataResponse = Json { ignoreUnknownKeys = true }.decodeFromString(responseBody)
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

    private suspend fun fetchMetodeverkPage(offset: String? = null): MetodeverkResponse {
        val url = buildString {
            append("https://api.airtable.com/v0/appzJQ8Tkmm8DobrJ/tblLZbUqA0XnUgC2v?view=viw2XliGUJu5448Hk")
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
        return Json { ignoreUnknownKeys = true }.decodeFromString(responseBody)
    }

    suspend fun fetchDataFromAlle(): AlleResponse {
        val response: HttpResponse = client.get("https://api.airtable.com/v0/appzJQ8Tkmm8DobrJ/tblLZbUqA0XnUgC2v")
        val responseBody = response.body<String>()
        val alleResponse: AlleResponse = Json { ignoreUnknownKeys = true }.decodeFromString(responseBody)
        return alleResponse
    }


}