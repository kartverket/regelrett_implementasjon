# The data model

Introduction to how the data model is structured.

## Table of contents

## Introduction - Why tho?

The purpose of an internal data model in the application is that we want flexibility
to use any source of data, and we want to be able to change the source of data without
having to alter the code for presenting it (the frontend). By using a consistent,
generic data model, we can modify, add or remove data sources as we please while only
having to face the challenge of mapping that specific APIs data structure into our own
model to make it available for our users.

Disclaimer: `*` denotes required attributes when objects are described.

## Questions

In the top level of the data model, we expect an array of questions. The philosophy of the current data model structure
is to separate the questions into three, distinct parts: required attributes, user submitted data and metadata.

* `id (string)*` - A unique identifier for the question.
* `question (string)*` - The text of the question being asked.
* `answers (array)` - An array of answers to the question.
* `comments (array)` - An optional array of comments to the question.
* `metadata (object)*` - Additional metadata related to the question and its answers.

An example of the most basic version of a question object:
```json
  {
    "id": "001",
    "question": "What is the capital of Spain?",
    "metadata": {
      "answerMetadata": {
        "type": "TEXT_SINGLE_LINE"
      }
    }
  }
```

### Question Metadata

Without a unique identifier or a question text it doesn't really qualify as a usable question, but you also have to
provide a minimum amount of metadata to be able to use the question in the application. The metadata object for a
question contains the following fields:

* `answerMetadata (object)*` - Metadata related to the answers of the question.
  * `type (string)*` - The type of answer the question expects. Possible values are:
    * `TEXT_SINGLE_LINE` - A single line of text.
    * `TEXT_MULTI_LINE` - Multiple lines of text.
    * `SELECT_SINGLE` - A single choice from a list of options.
    * `SELECT_MULTIPLE` - Multiple choices from a list of options.
  * `options (array)` - An array of options to choose from. Only required if the type is `SELECT_SINGLE` or `SELECT_MULTIPLE`.
* `optionalFields (array)` - An array of optional fields that can be used to provide additional information about the question.

The reason why the `answerMetadata` object is required, is that it is necessary to know what format the question should
be answered in. This gives of having questions with more concrete answers, multiple answer options and different types
of answers in the same schema.

An example of an answer metadata object that offers choices:
```json
{
  "type": "SELECT_SINGLE",
  "options": [
    "Madrid",
    "Barcelona",
    "Seville",
    "Valencia"
  ]
}
```

The optional fields are a way to provide additional information about the question. Common use cases can be to provide
more information about the criticality of answering the question, categorizing the question or giving more detailed
descriptions. The optional field object for questions looks as follows:

* `key (string)*` - A unique identifier for the optional field.
* * `value (string)*` - The value of the optional field.
* `type (string)*` - The type of the optional field. Possible values are:
  * `OPTION_MULTIPLE` - Multiple values from a list of options.
  * `OPTION_SINGLE` - A single option from a list of options.
  * `TEXT` - A single choice from a list of options.
* `options (array)` - An array of options to choose from. Only required if the type is `OPTION_SINGLE` or `OPTION_MULTIPLE`.

An example of an optional field object:
```json
{
  "key": "criticality",
  "value": "High",
  "type": "OPTION_SINGLE",
  "options": [
    "High",
    "Medium",
    "Low"
  ]
}
```

### Table

It is also possible to extract the questions into a table format, as this is one of the most effective ways to communicate
a question with tons of extra information. The table object contains the following fields:

* `id* (string)` - A unique identifier for the table.
* `name* (string)` - The name of the table.
* `fields* (array)` - An array listing all the fields questions in the table have.
* `records* (array)` - An array of records, each record containing an single question object.

Here is an exhaustive example showcasing all the possible attributes of the data model:

```json
[
  {
    "id": "Z-422",
    "question": "What is the capital of Spain?",
    "answers": [
      {
        "actor": "Don Quixote",
        "answer": "Madrid",
        "questionId": "Z-422",
        "question": "What is the capital of Spain?",
        "updated": "2021-01-01T00:00:00Z"
      }
    ],
    "comments":
    [
      {
        "actor": "Sancho Panza",
        "comment": "I think it's Barcelona",
        "questionId": "Z-422",
        "updated": "2021-01-01T00:00:00Z"
      }
    ],
    "metadata": {
      "answerMetadata": {
        "type": "TEXT_SINGLE_LINE"
      }
    }
  },
  {
    "id": "Z-422",
    "question": "What is the capital of France?",
    "answers": [],
    "metadata": {
      "answerMetadata": {
        "type": "SELECT_SINGLE",
        "options": [
          "Paris",
          "Lyon",
          "Marseille",
          "Toulouse"
        ]
      }
    }
  }
]
```