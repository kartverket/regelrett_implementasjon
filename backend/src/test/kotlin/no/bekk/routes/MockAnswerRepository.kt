package no.bekk.routes

import no.bekk.database.AnswerRepository
import no.bekk.database.DatabaseAnswer
import no.bekk.database.DatabaseAnswerRequest

interface MockAnswerRepository : AnswerRepository {
    override fun getAnswersByContextIdFromDatabase(contextId: String): List<DatabaseAnswer> {
        TODO("Not yet implemented")
    }

    override fun insertAnswerOnContext(answer: DatabaseAnswerRequest): DatabaseAnswer {
        TODO("Not yet implemented")
    }

    override fun copyAnswersFromOtherContext(newContextId: String, contextToCopy: String) {
        TODO("Not yet implemented")
    }

    override fun getAnswersByContextAndRecordIdFromDatabase(contextId: String, recordId: String): List<DatabaseAnswer> {
        TODO("Not yet implemented")
    }
}