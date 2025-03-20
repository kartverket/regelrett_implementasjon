package no.bekk.services

import no.bekk.configuration.AirTableInstanceConfig
import no.bekk.configuration.FormConfig
import no.bekk.configuration.YAMLInstanceConfig
import no.bekk.providers.AirTableProvider
import no.bekk.providers.FormProvider
import no.bekk.providers.YamlProvider
import no.bekk.providers.clients.AirTableClient

interface FormService {
    fun getFormProvider(formId: String): FormProvider
    fun getFormProviders(): List<FormProvider>
}

class FormServiceImpl(private val formConfig: FormConfig) : FormService {
    private val providers: List<FormProvider> = formConfig.forms.map { form ->
        when (form) {
            is AirTableInstanceConfig -> AirTableProvider(
                id = form.id,
                airtableClient = AirTableClient(
                    form.accessToken,
                    formConfig
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


    override fun getFormProvider(formId: String): FormProvider {
        return providers.find { it.id == formId } ?: throw Exception("Table $formId not found")
    }

    override fun getFormProviders(): List<FormProvider> {
        return providers
    }
}