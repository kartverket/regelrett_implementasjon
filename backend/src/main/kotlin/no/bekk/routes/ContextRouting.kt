package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.SerializationException
import kotlinx.serialization.json.Json
import no.bekk.authentication.AuthService
import no.bekk.database.*
import no.bekk.util.*

fun Route.contextRouting(
    authService: AuthService,
    answerRepository: AnswerRepository,
    contextRepository: ContextRepository,
    commentRepository: CommentRepository
) {
    route("/contexts") {
        post {
            safeExecute(call, logger, "Failed to create context") {
                val contextRequestJson = call.receiveText()
                logger.info("Received POST /context request")
                
                val contextRequest = try {
                    Json.decodeFromString<DatabaseContextRequest>(contextRequestJson)
                } catch (e: SerializationException) {
                    // Backwards compatibility handling - can be removed when all clients use formId
                    try {
                        val contextRequestOLD = Json.decodeFromString<OldDatabaseContextRequest>(contextRequestJson)
                        logger.debug("Using legacy context request format")
                        DatabaseContextRequest(
                            teamId = contextRequestOLD.teamId,
                            formId = contextRequestOLD.tableId,
                            name = contextRequestOLD.name,
                            copyContext = contextRequestOLD.copyContext,
                            copyComments = contextRequestOLD.copyComments
                        )
                    } catch (legacyException: SerializationException) {
                        throw ValidationException("Invalid context request format", legacyException)
                    }
                }

                validateAccess(
                    authService.hasTeamAccess(call, contextRequest.teamId),
                    "team ${contextRequest.teamId}",
                    "create context in"
                )

                val insertedContext = try {
                    logDatabaseOperation("insert_context") {
                        contextRepository.insertContext(contextRequest)
                    }
                } catch (e: no.bekk.database.UniqueConstraintViolationException) {
                    throw ConflictException(
                        "Context with this name already exists in the team",
                        e,
                        resource = "context"
                    )
                } catch (e: Exception) {
                    throw DatabaseException("Failed to create context", e, "insert_context")
                }

                // Handle copying from existing context
                val copyContext = contextRequest.copyContext
                if (copyContext != null) {
                    validateAccess(
                        authService.hasContextAccess(call, copyContext),
                        "context $copyContext",
                        "copy from"
                    )
                    
                    try {
                        logDatabaseOperation("copy_answers") {
                            answerRepository.copyAnswersFromOtherContext(insertedContext.id, copyContext)
                        }

                        if (contextRequest.copyComments == "yes") {
                            logDatabaseOperation("copy_comments") {
                                commentRepository.copyCommentsFromOtherContext(insertedContext.id, copyContext)
                            }
                        }
                        
                        logger.info("Successfully copied data from context $copyContext to ${insertedContext.id}")
                    } catch (e: Exception) {
                        throw DatabaseException("Failed to copy context data", e, "copy_context_data")
                    }
                }
                
                logger.info("Context ${insertedContext.id} created successfully")
                call.respond(HttpStatusCode.Created, Json.encodeToString(insertedContext))
            }
        }

        get {
            safeExecute(call, logger, "Failed to get contexts") {
                val teamId = validateRequired(call.request.queryParameters["teamId"], "teamId")
                val formId = call.request.queryParameters["formId"]
                logger.info("Received GET /contexts with teamId $teamId${formId?.let { " and formId $it" } ?: ""}")
                
                validateAccess(
                    authService.hasTeamAccess(call, teamId),
                    "team $teamId",
                    "view contexts for"
                )

                val result = if (formId != null) {
                    logDatabaseOperation("get_context_by_team_and_form") {
                        contextRepository.getContextByTeamIdAndFormId(teamId, formId)
                    }
                } else {
                    logDatabaseOperation("get_contexts_by_team") {
                        contextRepository.getContextsByTeamId(teamId)
                    }
                }
                
                call.respond(HttpStatusCode.OK, Json.encodeToString(result))
            }
        }

        route("/{contextId}") {
            get {
                safeExecute(call, logger, "Failed to get context") {
                    val contextId = validateRequired(call.parameters["contextId"], "contextId")
                    logger.info("Received GET /context with id: $contextId")

                    validateAccess(
                        authService.hasContextAccess(call, contextId),
                        "context $contextId"
                    )
                    
                    val context = logDatabaseOperation("get_context") {
                        contextRepository.getContext(contextId)
                    }
                    call.respond(HttpStatusCode.OK, Json.encodeToString(context))
                }
            }

            delete {
                safeExecute(call, logger, "Failed to delete context") {
                    val contextId = validateRequired(call.parameters["contextId"], "contextId")
                    logger.info("Received DELETE /context with id: $contextId")
                    
                    validateAccess(
                        authService.hasContextAccess(call, contextId),
                        "context $contextId",
                        "delete"
                    )
                    
                    logDatabaseOperation("delete_context") {
                        contextRepository.deleteContext(contextId)
                    }
                    
                    logger.info("Context $contextId deleted successfully")
                    call.respondText("Context and its answers and comments were successfully deleted.")
                }
            }

            patch("/team") {
                safeExecute(call, logger, "Failed to update context team") {
                    val contextId = validateRequired(call.parameters["contextId"], "contextId")
                    logger.info("Received PATCH /contexts/$contextId/team")

                    validateAccess(
                        authService.hasContextAccess(call, contextId),
                        "context $contextId",
                        "update team for"
                    )

                    val payload = try {
                        call.receive<TeamUpdateRequest>()
                    } catch (e: Exception) {
                        throw ValidationException("Invalid team update request", e)
                    }
                    
                    val newTeam = when {
                        payload.teamId != null -> payload.teamId
                        payload.teamName != null -> {
                            authService.getTeamIdFromName(call, payload.teamName)
                                ?: throw ValidationException(
                                    "Invalid team name: ${payload.teamName}",
                                    field = "teamName"
                                )
                        }
                        else -> throw ValidationException(
                            "Request must contain either teamId or teamName",
                            field = "teamId"
                        )
                    }

                    val success = logDatabaseOperation("change_context_team") {
                        contextRepository.changeTeam(contextId, newTeam)
                    }
                    
                    if (!success) {
                        throw DatabaseException("Failed to update context team", operation = "change_context_team")
                    }
                    
                    logger.info("Context $contextId team updated to $newTeam")
                    call.respond(HttpStatusCode.OK)
                }
            }
            
            patch("/answers") {
                safeExecute(call, logger, "Failed to copy answers") {
                    val contextId = validateRequired(call.parameters["contextId"], "contextId")
                    logger.info("Received PATCH /$contextId/answers")

                    val payload = try {
                        call.receive<CopyContextRequest>()
                    } catch (e: Exception) {
                        throw ValidationException("Invalid copy answers request", e)
                    }
                    
                    val copyContextId = validateRequired(payload.copyContextId, "copyContextId")

                    validateAccess(
                        authService.hasContextAccess(call, contextId),
                        "context $contextId",
                        "copy answers to"
                    )
                    
                    validateAccess(
                        authService.hasContextAccess(call, copyContextId),
                        "context $copyContextId",
                        "copy answers from"
                    )
                    
                    logDatabaseOperation("copy_answers") {
                        answerRepository.copyAnswersFromOtherContext(contextId, copyContextId)
                    }
                    
                    logger.info("Answers copied from context $copyContextId to $contextId")
                    call.respond(HttpStatusCode.OK)
                }
            }

            patch("/comments") {
                safeExecute(call, logger, "Failed to copy comments") {
                    val contextId = validateRequired(call.parameters["contextId"], "contextId")
                    logger.info("Received PATCH /$contextId/comments")

                    val payload = try {
                        call.receive<CopyContextRequest>()
                    } catch (e: Exception) {
                        throw ValidationException("Invalid copy comments request", e)
                    }
                    
                    val copyContextId = validateRequired(payload.copyContextId, "copyContextId")

                    validateAccess(
                        authService.hasContextAccess(call, contextId),
                        "context $contextId",
                        "copy comments to"
                    )
                    
                    validateAccess(
                        authService.hasContextAccess(call, copyContextId),
                        "context $copyContextId",
                        "copy comments from"
                    )
                    
                    logDatabaseOperation("copy_comments") {
                        commentRepository.copyCommentsFromOtherContext(contextId, copyContextId)
                    }
                    
                    logger.info("Comments copied from context $copyContextId to $contextId")
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}

@Serializable
data class TeamUpdateRequest(val teamName: String? = null, val teamId: String? = null)

@Serializable
data class CopyContextRequest(val copyContextId: String?)
