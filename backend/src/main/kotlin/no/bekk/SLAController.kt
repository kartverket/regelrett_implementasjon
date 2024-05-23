package no.bekk

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
import io.ktor.client.plugins.auth.providers.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.serialization.json.Json
import no.bekk.domain.AlleResponse
import no.bekk.domain.MetodeverkResponse
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock


val cache = mutableMapOf<String, MetodeverkResponse>()
val cacheMutex = Mutex()

private val accessToken = "patPdLroD158pgYMv.2b2593a9ea608c34c5197c15f8c5d20e2cf362b369fd48d637763e078981a04f"

class SLAController {

    suspend fun fetchDataFromMetodeverk(): MetodeverkResponse {
        cacheMutex.withLock {
            val cachedResponse = cache[accessToken]
            if (cachedResponse != null) {
                return cachedResponse
            }
        }

        val client = HttpClient(CIO) {
            install(Auth) {
                bearer {
                    loadTokens {
                        BearerTokens(accessToken, "")
                    }
                }
            }
        }
        val response: HttpResponse = client.get("https://api.airtable.com/v0/appzJQ8Tkmm8DobrJ/tblLZbUqA0XnUgC2v?view=viw2XliGUJu5448Hk")
        val responseBody = response.body<String>()
        client.close()
        val metodeverkResponse: MetodeverkResponse = Json { ignoreUnknownKeys = true }.decodeFromString(responseBody)
        cacheMutex.withLock {
            cache[accessToken] = metodeverkResponse
        }
        return metodeverkResponse

    }

    suspend fun fetchDataFromAlle(): AlleResponse {
        val client = HttpClient(CIO) {
            install(Auth) {
                bearer {
                    loadTokens {
                        BearerTokens(accessToken, "")
                    }
                }
            }
        }
        val response: HttpResponse = client.get("https://api.airtable.com/v0/appzJQ8Tkmm8DobrJ/tblLZbUqA0XnUgC2v")
        val responseBody = response.body<String>()
        client.close()
        val alleResponse: AlleResponse = Json { ignoreUnknownKeys = true }.decodeFromString(responseBody)
        return alleResponse
    }
}