package no.bekk.services

import no.bekk.configuration.AppConfig
import no.bekk.model.internal.*

interface TableService {
    val id: String
    suspend fun getTable(): Table
    suspend fun getQuestion(recordId: String): Question
    suspend fun getColumns(): List<Column>
}

val tableSources = listOf<TableService>(
    AirTableService(
        id = "570e9285-3228-4396-b82b-e9752e23cd73",
        airtableClient = AirTableClient(
            AppConfig.tables.sikkerhetskontroller.accessToken
        ),
        baseId = AppConfig.tables.sikkerhetskontroller.baseId,
        tableId = AppConfig.tables.sikkerhetskontroller.tableId,
        viewId = AppConfig.tables.sikkerhetskontroller.viewId,
    ),
    AirTableService(
        id = "816cc808-9188-44a9-8f4b-5642fc2932c4",
        airtableClient = AirTableClient(
            AppConfig.tables.driftskontinuitet.accessToken
        ),
        baseId = AppConfig.tables.driftskontinuitet.baseId,
        tableId = AppConfig.tables.driftskontinuitet.tableId,
        viewId = AppConfig.tables.driftskontinuitet.viewId,
    )
)

fun getTableService(tableId: String): TableService {
    return tableSources.find { it.id == tableId } ?: throw Exception("Table $tableId not found")
}
