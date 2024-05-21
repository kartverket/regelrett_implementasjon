CREATE TABLE IF NOT EXISTS questions
(
    id   SERIAL PRIMARY KEY,
    actor VARCHAR(255),
    question VARCHAR(255),
    answer VARCHAR(255)
);