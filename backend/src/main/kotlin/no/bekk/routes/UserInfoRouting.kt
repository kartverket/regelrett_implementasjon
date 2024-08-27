package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.authentication.getGroupsOrEmptyList

fun Route.userInfoRouting() {
    get("/userinfo"){
        val groups = getGroupsOrEmptyList(call)
        call.respond(mapOf("groups" to groups))
    }
}