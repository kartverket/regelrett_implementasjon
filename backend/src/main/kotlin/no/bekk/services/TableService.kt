package no.bekk.services

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import no.bekk.configuration.AppConfig
import no.bekk.providers.AirTableProvider
import no.bekk.providers.TableProvider
import no.bekk.providers.YamlProvider
import no.bekk.providers.clients.AirTableClient

class TableService(
    private val providers: List<TableProvider> = listOf<TableProvider>(
        AirTableProvider(
            id = "570e9285-3228-4396-b82b-e9752e23cd73",
            airtableClient = AirTableClient(
                AppConfig.tables.sikkerhetskontroller.accessToken
            ),
            baseId = AppConfig.tables.sikkerhetskontroller.baseId,
            tableId = AppConfig.tables.sikkerhetskontroller.tableId,
            viewId = AppConfig.tables.sikkerhetskontroller.viewId,
        ),
        AirTableProvider(
            id = "816cc808-9188-44a9-8f4b-5642fc2932c4",
            airtableClient = AirTableClient(
                AppConfig.tables.driftskontinuitet.accessToken
            ),
            baseId = AppConfig.tables.driftskontinuitet.baseId,
            tableId = AppConfig.tables.driftskontinuitet.tableId,
            viewId = AppConfig.tables.driftskontinuitet.viewId,
        ),
        YamlProvider(
            "a8459fa9-412f-4355-af3a-04fb5c4858bb",
            httpClient = HttpClient(CIO)
        )
    )
) {

    fun getTableProvider(tableId: String): TableProvider {
        return providers.find { it.id == tableId } ?: throw Exception("Table $tableId not found")
    }

    fun getTableProviders(): List<TableProvider> {
        return providers
    }
}