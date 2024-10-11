package no.bekk.util

import com.azure.identity.ClientSecretCredentialBuilder
import com.microsoft.graph.models.Group
import com.microsoft.graph.serviceclient.GraphServiceClient
import no.bekk.configuration.AppConfig
import no.bekk.configuration.getDatabaseConnection
import java.util.*

class TeamNameToTeamIdMapper {

    private fun isUUID(str: String): Boolean {
        return try {
            UUID.fromString(str)
            true
        } catch (e: Exception) {
            false
        }
    }

    fun changeFromTeamNameToTeamId() {
        val connection = getDatabaseConnection()
        connection.autoCommit = false
        try {

            val answersTeams = mutableListOf<String>()
            val commentsTeams = mutableListOf<String>()

            val answersQuery = "SELECT DISTINCT team FROM answers"
            val commentsQuery = "SELECT DISTINCT team FROM comments"

            val answersTeamsResultSet = connection.prepareStatement(answersQuery).executeQuery()
            while (answersTeamsResultSet.next()) {
                val team = answersTeamsResultSet.getString("team")
                if (team != null && !isUUID(team)) {
                    answersTeams.add(team)
                }
            }

            val commentsTeamsResultSet = connection.prepareStatement(commentsQuery).executeQuery()
            while (commentsTeamsResultSet.next()) {
                val team = commentsTeamsResultSet.getString("team")
                if (team != null && !isUUID(team)) {
                    commentsTeams.add(team)
                }
            }

            val answersUpdateStatement = connection.prepareStatement("UPDATE answers SET team = ? WHERE team = ?")
            val commentsUpdateStatement = connection.prepareStatement("UPDATE comments SET team = ? WHERE team = ?")

            for (teamName in answersTeams) {
                val group = MicrosoftService.getGroup(teamName)
                answersUpdateStatement.setString(1, group.id)
                answersUpdateStatement.setString(2, teamName)
                answersUpdateStatement.addBatch()
            }
            for (teamName in commentsTeams) {
                val group = MicrosoftService.getGroup(teamName)
                commentsUpdateStatement.setString(1, group.id)
                commentsUpdateStatement.setString(2, teamName)
                commentsUpdateStatement.addBatch()
            }

            answersUpdateStatement.executeBatch()
            commentsUpdateStatement.executeBatch()
            connection.commit()
            logger.info("Updated ${answersTeams.count()} teams in answer-table and ${commentsTeams.count()} in comment-table")
        } catch (e: Exception) {
            logger.error("Error when changing team-name to team-id: ${e.message}")
            throw RuntimeException("Error when changing team-name to team-id:", e)
        } finally {
            connection.autoCommit = true
            connection.close()
        }
    }
}

private object MicrosoftService {
    private val tenantId = AppConfig.oAuth.tenantId
    private val clientId = AppConfig.oAuth.clientId
    private val clientSecret = AppConfig.oAuth.clientSecret

    private val scopes = "https://graph.microsoft.com/.default"
    private val credential = ClientSecretCredentialBuilder().clientId(clientId).tenantId(tenantId).clientSecret(clientSecret).build()
    private val graphClient = GraphServiceClient(credential, scopes)

    fun getGroup(groupName: String): Group {
        return graphClient.groups().get {
            it.queryParameters.filter = "displayName eq 'AAD - TF - TEAM - $groupName'"
            it.queryParameters.select = arrayOf("id","displayName")
            it.queryParameters.count = true
            it.headers.add("ConsistencyLevel", "eventual")
        }.value[0]
    }
}