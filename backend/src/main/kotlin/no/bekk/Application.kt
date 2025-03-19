package no.bekk

import no.bekk.plugins.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.defaultheaders.*
import kotlinx.coroutines.*
import no.bekk.authentication.initializeAuthentication
import no.bekk.configuration.*
import no.bekk.database.AnswerRepository
import no.bekk.database.CommentRepository
import no.bekk.database.ContextRepository
import no.bekk.services.FormService
import no.bekk.services.MicrosoftService
import no.bekk.util.configureBackgroundTasks
import no.bekk.util.logger
import kotlin.time.Duration
import kotlin.time.Duration.Companion.days

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun CoroutineScope.launchCleanupJob(cleanupIntervalWeeks: String, database: Database): Job {
    val cleanupInterval: Duration = (cleanupIntervalWeeks.toInt() * 7).days

    return launch(Dispatchers.IO) {
        while (isActive) {
            try {
                logger.info("Running scheduled cleanup every $cleanupIntervalWeeks weeks.")
                cleanupAnswersHistory(database)
            } catch (e: Exception) {
                logger.error("Error during answers history cleanup: ${e.message}")
            }
            delay(cleanupInterval.inWholeMilliseconds)
        }
    }
}

fun cleanupAnswersHistory(database: Database) {
    logger.info("Running scheduled cleanup for answers table")
    val query =
        """
            WITH ranked_answers AS 
            (SELECT 
                id, 
                record_id, 
                context_id, 
                created, 
                ROW_NUMBER() OVER (PARTITION BY record_id, context_id ORDER BY created DESC) AS rn 
            FROM answers) 
            DELETE FROM answers 
            USING ranked_answers 
            WHERE answers.id = ranked_answers.id AND ranked_answers.rn > 3;
            """.trimIndent()

    database.getConnection().use { conn ->
        conn.prepareStatement(query).use { stmt ->
            val deletedRows = stmt.executeUpdate()
            logger.info("Answer cleanup completed. Deleted $deletedRows rows.")
        }
    }
}

fun Application.module() {
    val config = AppConfig.load(environment.config)
    val database = JDBCDatabase.create(config.db)
    val formService = FormService(config.formConfig)
    val microsoftService = MicrosoftService(config)

    AnswerRepository.database = database
    CommentRepository.database = database
    ContextRepository.database = database

    configureAPILayer(config, formService, microsoftService, database)
    configureBackgroundTasks(formService)

    launchCleanupJob(config.answerHistoryCleanup.cleanupIntervalWeeks, database)

    environment.monitor.subscribe(ApplicationStopped) {
        database.closePool()
    }
}

fun Application.configureAPILayer(config: AppConfig, formService: FormService, microsoftService: MicrosoftService, database: Database) {
    install(DefaultHeaders) {
        header(
            "Content-Security-Policy",
            "default-src 'self' '${config.backend.host}'; "
        )
    }
    install(ContentNegotiation) {
        json()
    }
    configureCors(config)
    initializeAuthentication(config.oAuth)
    configureRouting(config.oAuth, formService, microsoftService, database)
}
