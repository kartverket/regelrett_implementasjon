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
        AirTableProvider(
            id = "test-id",
            airtableClient = AirTableClient(
                "pat2QdLNw5u7Ga4Sy.28b74fac0af3ac73880bd76beaad43accf1fe034c60f953ad4a3c3a4686bf48a"
            ),
            baseId = "appUf88V03LISpurw",
            tableId = "tblmSy2Dalsp2Mw5W",
            viewId = "",
        ),
    )


    fun getTableProvider(tableId: String): TableProvider {
        return providers.find { it.id == tableId } ?: throw Exception("Table $tableId not found")
    }

    fun getTableProviders(): List<TableProvider> {
        return providers
    }
}