package no.bekk.services

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
import io.ktor.client.plugins.auth.providers.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.serialization.json.*
import no.bekk.configuration.AppConfig
import no.bekk.domain.AirtableResponse
import no.bekk.domain.AlleResponse
import no.bekk.domain.MetadataResponse
import no.bekk.domain.Record



class AirTableService {

    val json = Json { ignoreUnknownKeys = true }

    val client = HttpClient(CIO) {
        install(Auth) {
            bearer {
                loadTokens {
                    BearerTokens(AppConfig.airTable.accessToken, "")
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
        val response: HttpResponse = client.get(AppConfig.airTable.baseUrl + AppConfig.airTable.metadataPath)
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
            append(AppConfig.airTable.baseUrl + AppConfig.airTable.metodeVerkPath)
            if (offset != null) {
                append("&offset=$offset")
            }
        }
        val response: HttpResponse = client.get(url) {
            headers {
                append("Authorization", "Bearer ${AppConfig.airTable.accessToken}")
            }
        }
        val responseBody = response.bodyAsText()
        return json.decodeFromString(responseBody)
    }
}