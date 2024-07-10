package no.bekk.domain

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.jsonObject
import no.bekk.model.internal.Answer
import no.bekk.model.internal.Column
import no.bekk.model.internal.Comment
import no.bekk.model.internal.Question
import no.bekk.plugins.DatabaseAnswer
import no.bekk.plugins.DatabaseComment

@Serializable
data class AirtableResponse(
    val records: List<Record>,
    val offset: String? = null
)

@Serializable
data class Record(
    val id: String,
    val createdTime: String,
    val fields: JsonElement
)

fun Record.mapToQuestion(
    answer: DatabaseAnswer?,
    comment: DatabaseComment?
) = Question(
        id = id,
        updated = createdTime,
        columns = fields.jsonObject.entries.map { (key, value) ->
            Column(key, value)
        },
        answer = Answer(
            actor = answer?.actor ?: "Ukjent",
            questionId = id,
            answer = answer?.Svar ?: "",
            team = answer?.team,
            updated = answer?.updated ?: ""
        ),
        comment = Comment(
            actor = comment?.actor ?: "Ukjent",
            questionId = id,
            comment = comment?.comment ?: "",
            team = comment?.team,
            updated = comment?.updated ?: ""
        )
    )