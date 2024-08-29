package no.bekk.plugins

import io.ktor.util.*
import no.bekk.singletons.Env

object Config {
    val isDevelopment: Boolean
        get() = Env.get("ENVIRONMENT").toLowerCasePreservingASCIIRules() == "development"
}
