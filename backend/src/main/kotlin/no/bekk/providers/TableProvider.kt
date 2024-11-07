package no.bekk.providers

import com.github.benmanes.caffeine.cache.Cache
import no.bekk.model.internal.*

interface TableProvider {
    val id: String
    suspend fun getTable(): Table
    suspend fun getQuestion(recordId: String): Question
    suspend fun getColumns(): List<Column>
}