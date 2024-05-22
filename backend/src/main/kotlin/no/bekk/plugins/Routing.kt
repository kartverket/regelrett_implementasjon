package no.bekk.plugins

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.SLAController

val slaController = SLAController()

fun Application.configureRouting() {
    routing {
        get("/") {
            call.respondText("Velkommen til Kartverket Kontrollere!")
        }
    }
    routing {
        get("/metodeverk") {
            val data = slaController.fetchDataFromMetodeverk()
            val recordsString = buildString {
                data.records.forEachIndexed { index, record ->
                    appendLine("Record ${index + 1}:")
                    appendLine("ID: ${record.id}")
                    appendLine("Created Time: ${record.createdTime}")
                    appendLine("Fields:")
                    appendLine("ID: ${record.fields.ID}")
                    appendLine("PRI: ${record.fields.Pri}")
                    appendLine("Hvem: ${record.fields.Hvem}")
                    appendLine("Kode: ${record.fields.Kode}")
                    appendLine("Aktivitet: ${record.fields.Aktivitiet}")
                    appendLine("Kortnavn: ${record.fields.Kortnavn}")
                    appendLine("Ledetid: ${record.fields.Ledetid}")
                    appendLine("Område: ${record.fields.Område}")

                    appendLine()
                }
            }
            call.respondText(recordsString)

        }

    }

    routing {
        get("/alle") {
            val data = slaController.fetchDataFromAlle()
            call.respondText(data.records.toString())
        }

    }
}
