package no.bekk.providers

import no.bekk.model.internal.Table

interface Provider {
    suspend fun fetchData(team: String? = null): Table?
}