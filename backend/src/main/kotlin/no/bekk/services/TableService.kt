package no.bekk.services

import no.bekk.configuration.AppConfig
import no.bekk.providers.AirTableProvider
import no.bekk.providers.TableProvider
import no.bekk.providers.clients.AirTableClient

object TableService {
    private val providers: List<TableProvider> = listOf<TableProvider>(
        AirTableProvider(
            id = "570e9285-3228-4396-b82b-e9752e23cd73",
            airtableClient = AirTableClient(
                AppConfig.tables.sikkerhetskontroller.accessToken
            ),
            baseId = AppConfig.tables.sikkerhetskontroller.baseId,
            tableId = AppConfig.tables.sikkerhetskontroller.tableId,
            viewId = AppConfig.tables.sikkerhetskontroller.viewId,
            webhookId = AppConfig.tables.sikkerhetskontroller.webhookId,
            webhookSecret = AppConfig.tables.sikkerhetskontroller.webhookSecret,
        ),
        AirTableProvider(
            id = "816cc808-9188-44a9-8f4b-5642fc2932c4",
            airtableClient = AirTableClient(
                AppConfig.tables.driftskontinuitet.accessToken
            ),
            baseId = AppConfig.tables.driftskontinuitet.baseId,
            tableId = AppConfig.tables.driftskontinuitet.tableId,
            viewId = AppConfig.tables.driftskontinuitet.viewId,
            webhookId = AppConfig.tables.driftskontinuitet.webhookId,
            webhookSecret = AppConfig.tables.driftskontinuitet.webhookSecret,
        ),
        AirTableProvider(
            id = "test-table",
            airtableClient = AirTableClient(
                System.getenv("AIRTABLE_TEST_TOKEN")
            ),
            baseId = "appJFzRzW8GmaKuz3",
            tableId = "tblbiZLh6qn3k7wdt",
            viewId = "",
            webhookId = "achpY1AcPW93B9ucr",
            webhookSecret = System.getenv("AIRTABLE_WEBHOOK_SECRET")
        ),
    )


    fun getTableProvider(tableId: String): TableProvider {
        return providers.find { it.id == tableId } ?: throw Exception("Table $tableId not found")
    }

    fun getTableProviders(): List<TableProvider> {
        return providers
    }
}