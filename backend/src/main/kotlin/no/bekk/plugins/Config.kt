package no.bekk.plugins

object Config {
    val isDevelopment: Boolean
        get() = System.getenv("ENVIRONMENT") == "development"
}
