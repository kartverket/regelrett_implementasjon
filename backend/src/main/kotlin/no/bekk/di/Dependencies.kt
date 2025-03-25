package no.bekk.di

import no.bekk.authentication.AuthService
import no.bekk.configuration.Database
import no.bekk.database.AnswerRepository
import no.bekk.database.CommentRepository
import no.bekk.database.ContextRepository
import no.bekk.services.FormService

class Dependencies(
    val database: Database,
    val formService: FormService,
    val answerRepository: AnswerRepository,
    val commentRepository: CommentRepository,
    val contextRepository: ContextRepository,
    val authService: AuthService,
)