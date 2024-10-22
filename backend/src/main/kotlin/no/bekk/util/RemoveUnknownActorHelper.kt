package no.bekk.util

import no.bekk.configuration.getDatabaseConnection

class RemoveUnknownActorHelper {

    fun run() {
        val connection = getDatabaseConnection()
        connection.autoCommit = false
        try {
            val deleteUnknownActorCommentsQuery = "DELETE FROM comments WHERE actor = 'Unknown'"
            val deleteUnknownActorAnswersQuery = "DELETE FROM answers WHERE actor = 'Unknown'"

            connection.prepareStatement(deleteUnknownActorCommentsQuery).execute()
            connection.prepareStatement(deleteUnknownActorAnswersQuery).execute()

            connection.commit()
            logger.info("Successfully removed unknown actor")
        } catch (e: Exception) {
            throw RuntimeException("Error removing unknown actor", e)
        } finally {
            connection.autoCommit = true
            connection.close()
        }
    }
}