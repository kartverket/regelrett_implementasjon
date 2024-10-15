package no.bekk.providers

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.server.plugins.*
import net.mamoe.yamlkt.Yaml
import no.bekk.model.internal.*

class YamlProvider(
    override val id: String,
    private val httpClient: HttpClient? = null,
    private val endpoint: String? = null,
    private val resourcePath: String? = null
) : TableProvider {

    init {
        require((endpoint != null && httpClient != null) || resourcePath != null) {
            "endpoint and httpClient or resourcePath must be set"
        }
    }

    override suspend fun getTable(): Table {
        if (endpoint != null) {
            return getTableFromYamlEndpoint()
        } else {
            return getTableFromResourcePath()
        }
    }

    override suspend fun getColumns(): List<Column> {
        if (endpoint != null) {
            return getTableFromYamlEndpoint().columns
        } else {
            return getTableFromResourcePath().columns
        }
    }

    override suspend fun getQuestion(recordId: String): Question {
        if (endpoint != null) {
            return getTableFromYamlEndpoint().records.find { it.id == recordId } ?: run {
                throw NotFoundException("Question $recordId not found")
            }

        } else {
            return getTableFromResourcePath().records.find { it.id == recordId } ?: run {
                throw NotFoundException("Question $recordId not found")
            }
        }
    }

    private suspend fun getTableFromYamlEndpoint(): Table {
        require(endpoint != null && httpClient != null) { "endpoint and httpClient must not be null" }
        val response = httpClient.get(endpoint)
        val responseBody = response.bodyAsText()
        return parseAndConvertToTable(responseBody)
    }

    private fun getTableFromResourcePath(): Table {
        require(resourcePath != null) { "Resource path not set" }
        val body = this::class.java.classLoader.getResource(resourcePath)?.readText()
            ?: throw NotFoundException("Resource not found: $resourcePath")
        return parseAndConvertToTable(body)

    }

    private fun parseAndConvertToTable(yamlString: String): Table {
        val table = Yaml.decodeFromString(TableWithoutId.serializer(), yamlString)

        return Table(
            id = id,
            name = table.name,
            columns = table.columns,
            records = table.records.map {
                Question(
                    id = it.id,
                    recordId = it.id,   // need to set recordId since all endpoints require it as of now
                    question = it.question,
                    metadata = it.metadata,
                )
            },
        )
    }

}