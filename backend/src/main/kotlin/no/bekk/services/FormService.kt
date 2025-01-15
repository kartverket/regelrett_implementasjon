package no.bekk.services

import no.bekk.configuration.AirTableInstanceConfig
import no.bekk.configuration.AppConfig
import no.bekk.configuration.YAMLInstanceConfig
import no.bekk.providers.AirTableProvider
import no.bekk.providers.FormProvider
import no.bekk.providers.YamlProvider
import no.bekk.providers.clients.AirTableClient

object FormService {


  private val providers: List<FormProvider> = AppConfig.formConfig.forms.map { table ->
        when (table) {
            is AirTableInstanceConfig -> AirTableProvider(
                id = table.id,
                airtableClient = AirTableClient(
                    table.accessToken
                ),
                baseId = table.baseId,
                tableId =   table.tableId,
                viewId = table.viewId,
                webhookId = table.webhookId,
                webhookSecret = table.webhookSecret,
            )
            is YAMLInstanceConfig -> YamlProvider(
                id = table.id,
                endpoint = table.endpoint,
                resourcePath =   table.resourcePath,
            )
            else ->  throw Exception("Valid tabletype not found")

        }
    }


    fun getTableProvider(tableId: String): FormProvider {
        return providers.find { it.id == tableId } ?: throw Exception("Table $tableId not found")
    }

    fun getTableProviders(): List<FormProvider> {
        return providers
    }
}