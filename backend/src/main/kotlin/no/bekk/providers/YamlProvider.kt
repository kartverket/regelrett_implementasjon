package no.bekk.providers

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import no.bekk.model.internal.Field
import no.bekk.model.internal.OptionalFieldType
import no.bekk.model.internal.Question
import no.bekk.model.internal.Table

class YamlService: Provider {
    override suspend fun fetchData(): Table? {
        val yamlFile = this::class.java.classLoader.getResource(TEST_FILE)?.readText()
            return convertData(yamlFile!!)
    }

    private fun convertData(yamlFile: String): Table? {
        val module = SimpleModule().apply {
            addDeserializer(Table::class.java, YamlDeserializer)
        }
        val objectMapper = ObjectMapper(YAMLFactory()).apply {
            registerModule(module)
            registerKotlinModule()
        }
        var table: Table? = null;
        try {

            table  = objectMapper.readValue(yamlFile, Table::class.java)
            return table
        } catch (e: Exception) {
           println(e.message)
            e.printStackTrace()
        }
    return table
    }

    companion object {
        const val TEST_FILE = "questions/testQuestions.yaml"
    }

    object YamlDeserializer : JsonDeserializer<Table>() {
        override fun deserialize(p0: JsonParser, p1: DeserializationContext): Table {
            val node = p0.readValueAsTree<JsonNode>()
            val objectMapper = p0.codec as ObjectMapper

            val id = node.get("id").asText()
            val name = node.get("name").asText()

            val columnsNode = node.get("columns")
            val fields = columnsNode.map { columnNode ->
                Field(
                    type = OptionalFieldType.OPTION_SINGLE,
                    name = columnNode.asText(),
                    options = null
                )
            }

            val recordsNode = node.get("records")
            val records: List<Question> = recordsNode.map { recordNode ->
                objectMapper.treeToValue(recordNode, Question::class.java)
            }

            return Table(
                id = id,
                name = name,
                fields = fields,
                records = records
            )
        }
    }
}