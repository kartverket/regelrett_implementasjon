package no.bekk.services.provisioning

import no.bekk.configuration.Config
import no.bekk.services.FormService
import no.bekk.services.provisioning.schemasources.SchemaSourceProvisioner
import no.bekk.util.logger
import kotlin.io.path.Path
import kotlin.io.path.pathString

interface ProvisioningService {
    fun runInitialProvisioners()
    fun provisionSchemaSources()
    // provisionAuth()
}

fun provideProvisioningService(cfg: Config, formService: FormService) = ProvisioningServiceImpl(
    cfg,
    formService,
    SchemaSourceProvisioner::provision,
)

class ProvisioningServiceImpl(
    private val cfg: Config,
    private val formService: FormService,
    private val provisionSchemaSourcesFunc: (String, FormService) -> Unit,
) : ProvisioningService {
    override fun runInitialProvisioners() {
        try {
            provisionSchemaSources()
            // provisionAuth()
        } catch (e: Exception) {
            logger.error("Failed to provision Schema Sources:", e)
            throw e
        }
    }
    override fun provisionSchemaSources() {
        val schemasourcePath = Path(cfg.paths.provisioning, "schemasources")
        try {
            this.provisionSchemaSourcesFunc(schemasourcePath.pathString, formService)
        } catch (e: Exception) {
            logger.error("Failed to provision schema sources:", e)
            throw e
        }
    }
}
