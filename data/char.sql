
DROP TABLE IF EXISTS favchar;

CREATE TABLE favchar(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    img VARCHAR(255),
    level VARCHAR(255)
);