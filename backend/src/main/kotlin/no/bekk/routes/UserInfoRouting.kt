package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.authentication.getGroupsOrEmptyList

fun Route.userInfoRouting() {
    get("/userinfo"){
        val groups = getGroupsOrEmptyList(call)

        if(groups.isNotEmpty()){
            call.respond(mapOf("groups" to groups))
        } else {
            call.respondText("Error could not fetch user info. User is missing required groups.", status = HttpStatusCode.InternalServerError)
        }
    }
}