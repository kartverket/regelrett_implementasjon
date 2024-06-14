package no.bekk

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
import io.ktor.client.plugins.auth.providers.*
import io.ktor.client.request.*
import io.ktor.client.request.headers
import io.ktor.client.statement.*
import kotlinx.serialization.json.*
import no.bekk.domain.AirtableResponse
import no.bekk.domain.AlleResponse
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

    private fun filterDataOnStop(metadataResponse: MetadataResponse): MetadataResponse {
        val newTables = metadataResponse.tables.map { table ->
            val fields = table.fields
            if (!fields.isNullOrEmpty()) {
                val stopIndex = fields.indexOfFirst { it.name == "STOP" }
                if (stopIndex != -1) {
                    val newFields = fields.slice(0..< stopIndex)
                    table.copy(fields = newFields)
                } else {
                    table
                }
            } else {
                table
            }
        }

        return metadataResponse.copy(tables = newTables)
    }

    suspend fun fetchDataFromMetadata(): MetadataResponse {

        val response: HttpResponse = client.get(metadataAddress)
        val responseBody = response.body<String>()
        val metadataResponse: MetadataResponse = json.decodeFromString(responseBody)
        val filteredMetaData = filterDataOnStop(metadataResponse = metadataResponse)
        return filteredMetaData

    }

    suspend fun fetchDataFromMetodeverk(): AirtableResponse {
        var offset: String? = null
        val allRecords = mutableListOf<Record>()
        do {
            val response = fetchMetodeverkPage(offset)
            val records = response.records
            allRecords.addAll(records)
            offset = response.offset
        } while (offset != null)

        return AirtableResponse(allRecords)
    }


    private suspend fun fetchMetodeverkPage(offset: String? = null): AirtableResponse {
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