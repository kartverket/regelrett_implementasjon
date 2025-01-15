package no.bekk.providers

import no.bekk.model.internal.*

interface FormProvider {
    val id: String
    suspend fun getForm(): Table
    suspend fun getQuestion(recordId: String): Question
    suspend fun getColumns(): List<Column>
    suspend fun getSchema(): Schema
}