package no.bekk.plugins

import io.ktor.util.*

object Config {
    val isDevelopment: Boolean
        get() = System.getenv("ENVIRONMENT").toLowerCasePreservingASCIIRules() == "development"
}
