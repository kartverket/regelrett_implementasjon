package no.bekk.providers

import com.charleskorn.kaml.Yaml
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.server.plugins.*
import no.bekk.domain.Metadata
import no.bekk.model.internal.*

class YamlProvider(
    override val id: String,
    private val httpClient: HttpClient,
    private val endpoint: String? = null,
) : TableProvider {
    companion object {
        const val TEST_FILE = "questions/testQuestions.yaml"
    }

    override suspend fun getTable(): Table {
        return getTableFromYamlEndpoint()
    }

    override suspend fun getColumns(): List<Column> {
        return getTableFromYamlEndpoint().columns
    }

    override suspend fun getQuestion(recordId: String): Question {
        return getTableFromYamlEndpoint().records.find { it.id == recordId } ?: run {
            throw NotFoundException("Question $recordId not found")
        }
    }

    private suspend fun getTableFromYamlEndpoint(): Table {
        val responseBody: String
        if (endpoint != null) {
            val response = httpClient.get(endpoint)
            responseBody = response.bodyAsText()
        } else {
            responseBody = this::class.java.classLoader.getResource(TEST_FILE)?.readText() ?: run {
                throw Exception("No test file exists.")
            }
        }
        val table =  Yaml.default.decodeFromString(TableWithoutId.serializer(), responseBody)

        return Table(
            id = id,
            name = table.name,
            columns = table.columns,
            records = table.records.map {
                Question(
                    id = it.id,
                    recordId = it.id,
                    question = it.question,
                    metadata = it.metadata,
                )
            },
        )
    }
}