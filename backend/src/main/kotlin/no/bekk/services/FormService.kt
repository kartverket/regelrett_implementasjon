package no.bekk.services

import no.bekk.configuration.AirTableInstanceConfig
import no.bekk.configuration.AppConfig
import no.bekk.configuration.YAMLInstanceConfig
import no.bekk.providers.AirTableProvider
import no.bekk.providers.FormProvider
import no.bekk.providers.YamlProvider
import no.bekk.providers.clients.AirTableClient

class FormService(private val config: AppConfig) {
    private val providers: List<FormProvider> = config.formConfig.forms.map { form ->
        when (form) {
            is AirTableInstanceConfig -> AirTableProvider(
                id = form.id,
                airtableClient = AirTableClient(
                    form.accessToken,
                    config
                ),
                baseId = form.baseId,
                tableId = form.tableId,
                viewId = form.viewId,
                webhookId = form.webhookId,
                webhookSecret = form.webhookSecret,
            )

            is YAMLInstanceConfig -> YamlProvider(
                id = form.id,
                endpoint = form.endpoint,
                resourcePath = form.resourcePath,
            )

            else -> throw Exception("Valid tabletype not found")

        }
    }


    fun getFormProvider(formId: String): FormProvider {
        return providers.find { it.id == formId } ?: throw Exception("Table $formId not found")
    }

    fun getFormProviders(): List<FormProvider> {
        return providers
    }
}