package no.bekk.util

import com.azure.identity.ClientSecretCredentialBuilder
import com.microsoft.graph.models.Group
import com.microsoft.graph.serviceclient.GraphServiceClient
import no.bekk.configuration.AppConfig
import no.bekk.configuration.getDatabaseConnection
import no.bekk.database.*
import java.util.UUID

class RemoveTeamAndFunctionHelper {
    val contextRepository = ContextRepository()
    fun run() {
        val connection = getDatabaseConnection()
        connection.autoCommit = false
        try {
            val deleteContextAnswersQuery = "DELETE FROM answers WHERE context_id NOT IN (SELECT id FROM contexts)"
            val deleteContextCommentsQuery = "DELETE FROM comments WHERE context_id NOT IN (SELECT id FROM contexts)"
            val deleteFunctionAnswersQuery = "DELETE FROM answers WHERE function_id IS NOT NULL"
            val deleteFunctionCommentsQuery = "DELETE FROM comments WHERE function_id IS NOT NULL"

            connection.prepareStatement(deleteContextAnswersQuery).execute()
            connection.prepareStatement(deleteContextCommentsQuery).execute()
            connection.prepareStatement(deleteFunctionAnswersQuery).execute()
            connection.prepareStatement(deleteFunctionCommentsQuery).execute()

            val getAllTeamsAnswersQuery = "SELECT DISTINCT team FROM answers WHERE team IS NOT NULL"
            val getAllTeamsCommentsQuery = "SELECT DISTINCT team FROM answers WHERE team IS NOT NULL"

            val teams = mutableSetOf<String>()

            var resultSet = connection.prepareStatement(getAllTeamsAnswersQuery).executeQuery()
            while (resultSet.next()) {
                teams.add(
                    resultSet.getString("team")
                )
            }
            resultSet = connection.prepareStatement(getAllTeamsCommentsQuery).executeQuery()
            while (resultSet.next()) {
                teams.add(
                    resultSet.getString("team")
                )
            }


            val updateAnswersStatement = connection.prepareStatement("UPDATE answers SET context_id = ?, team = NULL WHERE team = ?")
            val updateCommentsStatement = connection.prepareStatement("UPDATE comments SET context_id = ?, team = NULL WHERE team = ?")
            for (team in teams) {
                val group = MicrosoftServiceInternal2.getGroup(team)
                val inserted = contextRepository.insertContext(
                    DatabaseContextRequest(
                        teamId = team,
                        name = group.displayName
                    )
                )
                updateAnswersStatement.setObject(1, UUID.fromString(inserted.id))
                updateAnswersStatement.setString(2, group.id)
                updateAnswersStatement.addBatch()

                updateCommentsStatement.setObject(1, UUID.fromString(inserted.id))
                updateCommentsStatement.setString(2, group.id)
                updateCommentsStatement.addBatch()
            }

            updateAnswersStatement.executeBatch()
            updateCommentsStatement.executeBatch()
            connection.commit()
            logger.info("Updated ${teams.size} answers or comments")
        } catch (e: Exception) {
            throw RuntimeException("Error migrating to context", e)
        } finally {
            connection.autoCommit = true
            connection.close()
        }
    }
}

private object MicrosoftServiceInternal2 {
    private val tenantId = AppConfig.oAuth.tenantId
    private val clientId = AppConfig.oAuth.clientId
    private val clientSecret = AppConfig.oAuth.clientSecret

    private val scopes = "https://graph.microsoft.com/.default"
    private val credential = ClientSecretCredentialBuilder().clientId(clientId).tenantId(tenantId).clientSecret(clientSecret).build()
    private val graphClient = GraphServiceClient(credential, scopes)

    fun getGroup(groupId: String): Group {
        return graphClient.groups().byGroupId(groupId).get()
    }
}