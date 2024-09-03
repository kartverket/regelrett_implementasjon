package no.bekk.singletons

import io.github.cdimascio.dotenv.Dotenv

object Env {
    private val dotenv = Dotenv.configure().load()

    fun get(key: String): String {
        return dotenv[key]
    }
}