package no.bekk.plugins

import io.ktor.server.application.createApplicationPlugin
import io.ktor.server.plugins.origin
import no.bekk.util.logger
import no.bekk.util.setRequestId

val RequestLoggingPlugin =
    createApplicationPlugin(name = "RequestLoggingPlugin") {
      onCall { call ->
        // Set request ID for correlation
        call.setRequestId()
        
        call.request.origin.apply {
          logger.debug("Request URL: $scheme://$localHost:$localPort$uri")
        }
      }
    }
