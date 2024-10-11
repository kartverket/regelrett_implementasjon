package no.bekk.util

import no.bekk.configuration.getDatabaseConnection
import no.bekk.providers.AirTableProvider
import no.bekk.services.TableService
import java.sql.Connection
import java.sql.SQLException

class TableIDMapper {
    suspend fun run() {
        val tableService = TableService()
        tableService.getTableProviders().forEach { tableProvider ->
            when (tableProvider) {
                is AirTableProvider -> {
                    val tableId = tableProvider.id
                    val recordIds = getRecordIdSetFromAirTable(tableProvider)
                    updateTableIdsInDatabase(recordIds, tableId)
                }
            }
        }
    }

    private suspend fun getRecordIdSetFromAirTable(airTableProvider: AirTableProvider): Set<String> {
        val airTableData = airTableProvider.fetchAllRecordsFromTable()
        return airTableData.records.map { record ->
            record.id
        }.toSet()
    }

    fun updateTableIdsInDatabase(recordIds: Set<String>, tableId: String) {
        val connection = getDatabaseConnection()
        connection.autoCommit = false
        try {
            val hasEmptyTableIds =
                hasEmptyTableIds(connection, "SELECT COUNT(*) FROM answers WHERE table_id = 'empty' OR table_id IS NULL") ||
                hasEmptyTableIds(connection, "SELECT COUNT(*) FROM comments WHERE table_id = 'empty' OR table_id IS NULL")
            if (!hasEmptyTableIds) {
                logger.info("No empty table IDs found. No updates will be performed for table $tableId")
                return
            }

            val updateAnswersStatement =
                connection.prepareStatement("UPDATE answers SET table_id = ? WHERE record_id = ? AND (table_id = 'empty' OR table_id IS NULL)")
            val updateCommentsStatement =
                connection.prepareStatement("UPDATE comments SET table_id = ? WHERE record_id = ? AND (table_id = 'empty' OR table_id IS NULL)")


            for (recordId in recordIds) {
                updateAnswersStatement.setString(1, tableId)
                updateAnswersStatement.setString(2, recordId)
                updateAnswersStatement.addBatch()

                updateCommentsStatement.setString(1, tableId)
                updateCommentsStatement.setString(2, recordId)
                updateCommentsStatement.addBatch()
            }

            val updatedAnswers = updateAnswersStatement.executeBatch()
            val updatedComments = updateCommentsStatement.executeBatch()

            connection.commit()

            val updatedAnswersCount = updatedAnswers.sum()
            val updatedCommentsCount = updatedComments.sum()

            logger.info("Updated $updatedAnswersCount answers and $updatedCommentsCount comments for table $tableId")
        } catch (e: SQLException) {
            logger.error("Error updating table IDs in database: ${e.message}")
            throw RuntimeException("Error updating table IDs in database", e)
        } finally {
            connection.autoCommit = true
            connection.close()
        }
    }


    private fun hasEmptyTableIds(connection: Connection, query: String): Boolean {
        val statement = connection.prepareStatement(query)
        val resultSet = statement.executeQuery()
        resultSet.next()
        val count = resultSet.getInt(1)
        return count > 0
    }

}