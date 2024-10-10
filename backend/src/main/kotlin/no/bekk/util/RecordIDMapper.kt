package no.bekk.util

import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import no.bekk.configuration.getDatabaseConnection
import no.bekk.providers.AirTableProvider
import no.bekk.services.TableService
import java.sql.Connection
import java.sql.SQLException

class RecordIDMapper {

    suspend fun run() {
        val tableService = TableService()
        tableService.getTableProviders().forEach {
            when (it) {
                is AirTableProvider -> updateRecordIdsInDatabase(getIdMapFromAirTable(it))
            }
        }
    }

    private suspend fun getIdMapFromAirTable(airTableService: AirTableProvider): Map<String, Pair<String, String>> {
        val airTableData = airTableService.fetchAllRecordsFromTable()
        return airTableData.records.mapNotNull { record ->
            val questionId = record.fields.jsonObject["ID"]?.jsonPrimitive?.content
            val answerType = record.fields.jsonObject["Svartype"]?.jsonPrimitive?.content
            questionId?.let { it to (record.id to (answerType ?: "empty")) }
        }.toMap()
    }

    fun updateRecordIdsInDatabase(idMap: Map<String, Pair<String, String>>) {
        val connection = getDatabaseConnection()
        connection.autoCommit = false
        try {
            val hasEmptyRecordIds =
                hasEmptyRecordIds(connection, "SELECT COUNT(*) FROM answers WHERE record_id = 'empty'") ||
                        hasEmptyRecordIds(connection, "SELECT COUNT(*) FROM comments WHERE record_id = 'empty'") ||
                        hasEmptyRecordIds(connection, "SELECT COUNT(*) FROM answers WHERE answer_type = 'empty'")
            if (!hasEmptyRecordIds) {
                logger.info("No empty record IDs found. No updates will be performed")
                return
            }

            val updateAnswersStatement =
                connection.prepareStatement("UPDATE answers SET record_id = ? WHERE question_id = ?")
            val updateCommentsStatement =
                connection.prepareStatement("UPDATE comments SET record_id = ? WHERE question_id = ?")
            val updateAnswerTypeStatement =
                connection.prepareStatement("UPDATE answers SET answer_type = ? WHERE question_id = ?")

            for ((questionId, value) in idMap) {
                val (recordId, answerType) = value
                
                updateAnswersStatement.setString(1, recordId)
                updateAnswersStatement.setString(2, questionId)
                updateAnswersStatement.addBatch()

                updateCommentsStatement.setString(1, recordId)
                updateCommentsStatement.setString(2, questionId)
                updateCommentsStatement.addBatch()

                updateAnswerTypeStatement.setString(1, answerType)
                updateAnswerTypeStatement.setString(2, questionId)
                updateAnswerTypeStatement.addBatch()
            }

            updateAnswersStatement.executeBatch()
            updateCommentsStatement.executeBatch()
            updateAnswerTypeStatement.executeBatch()

            connection.commit()
            logger.info("Record ID's updated successfully")
        } catch (e: SQLException) {
            logger.error("Error updating record id's in database ${e.message}")
            throw RuntimeException("Error updating record id's in database", e)
        } finally {
            connection.autoCommit = true
            connection.close()
        }
    }

    fun hasEmptyRecordIds(connection: Connection, query: String): Boolean {
        val statement = connection.prepareStatement(query)
        val resultSet = statement.executeQuery()
        resultSet.next()
        val count = resultSet.getInt(1)
        return count > 0
    }
}