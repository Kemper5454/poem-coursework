DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS poems CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS users_app CASCADE;

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    birth_year INT,
    country VARCHAR(100)
);

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users_app (
    id SERIAL PRIMARY KEY,
    login VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
    name VARCHAR(100),
    email VARCHAR(150),
    age INT
);

CREATE TABLE poems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    text TEXT NOT NULL,
    author_id INT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    genre_id INT NOT NULL REFERENCES genres(id) ON DELETE RESTRICT,
    rating INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    poem_id INT NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
    user_id INT REFERENCES users_app(id) ON DELETE SET NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW poems_full_view AS
SELECT 
    p.id,
    p.title,
    p.text,
    p.rating,
    a.full_name AS author,
    g.name AS genre,
    p.created_at,
    p.updated_at
FROM poems p
JOIN authors a ON p.author_id = a.id
JOIN genres g ON p.genre_id = g.id;

CREATE VIEW poems_rating_view AS
SELECT
    p.id,
    p.title,
    COALESCE(p.rating, 0) AS average_rating,
    CASE WHEN p.rating IS NULL THEN 0 ELSE 1 END AS reviews_count
FROM poems p;

CREATE VIEW authors_stats_view AS
SELECT
    a.id,
    a.full_name,
    COUNT(p.id) AS poems_count
FROM authors a
LEFT JOIN poems p ON a.id = p.author_id
GROUP BY a.id, a.full_name;

CREATE OR REPLACE FUNCTION get_poems_count_by_author(author_id_param INT)
RETURNS INT AS $$
DECLARE
    result_count INT;
BEGIN
    SELECT COUNT(*) INTO result_count
    FROM poems
    WHERE author_id = author_id_param;

    RETURN result_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_average_poem_rating(poem_id_param INT)
RETURNS NUMERIC AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    SELECT COALESCE(rating, 0) INTO avg_rating
    FROM poems
    WHERE id = poem_id_param;

    RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_poems_by_title(search_text TEXT)
RETURNS TABLE (
    id INT,
    title VARCHAR,
    text TEXT,
    rating INT,
    author VARCHAR,
    genre VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.text,
        p.rating,
        a.full_name AS author,
        g.name AS genre
    FROM poems p
    JOIN authors a ON p.author_id = a.id
    JOIN genres g ON p.genre_id = g.id
    WHERE LOWER(p.title) LIKE LOWER('%' || search_text || '%');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE add_poem(
    title_param VARCHAR,
    text_param TEXT,
    author_id_param INT,
    genre_id_param INT,
    rating_param INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO poems(title, text, author_id, genre_id, rating)
    VALUES(title_param, text_param, author_id_param, genre_id_param, rating_param);
END;
$$;

CREATE OR REPLACE PROCEDURE update_poem_title(
    poem_id_param INT,
    new_title_param VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE poems
    SET title = new_title_param
    WHERE id = poem_id_param;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_poem(
    poem_id_param INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM poems
    WHERE id = poem_id_param;
END;
$$;

CREATE OR REPLACE FUNCTION check_poem_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.rating IS NOT NULL AND (NEW.rating < 1 OR NEW.rating > 5) THEN
        RAISE EXCEPTION 'Rating must be between 1 and 5';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_poem_rating
BEFORE INSERT OR UPDATE ON poems
FOR EACH ROW
EXECUTE FUNCTION check_poem_rating();

CREATE OR REPLACE FUNCTION check_review_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.rating < 1 OR NEW.rating > 5 THEN
        RAISE EXCEPTION 'Rating must be between 1 and 5';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_review_rating
BEFORE INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION check_review_rating();

CREATE OR REPLACE FUNCTION update_poem_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_poem_updated_at
BEFORE UPDATE ON poems
FOR EACH ROW
EXECUTE FUNCTION update_poem_updated_at();

INSERT INTO authors(full_name, birth_year, country) VALUES
('Александр Пушкин', 1799, 'Россия'),
('Михаил Лермонтов', 1814, 'Россия'),
('Сергей Есенин', 1895, 'Россия');

INSERT INTO genres(name) VALUES
('Лирика'),
('Пейзажная лирика'),
('Философская лирика');

INSERT INTO users_app(login, password_hash, role, name, email, age) VALUES
(
  'admin',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  'admin',
  'Администратор',
  'admin@example.com',
  25
),
(
  'user',
  'e606e38b0d8c19b24cf0ee3808183162ea7cd63ff7912dbb22b5e803286b4446',
  'user',
  'Пользователь',
  'user@example.com',
  20
);

INSERT INTO poems(title, text, author_id, genre_id, rating) VALUES
('Зимнее утро', 'Мороз и солнце; день чудесный...', 1, 2, 5),
('Парус', 'Белеет парус одинокий...', 2, 3, 4),
('Берёза', 'Белая берёза под моим окном...', 3, 2, 5);

INSERT INTO reviews(poem_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Оценка администратора'),
(2, 1, 4, 'Оценка администратора'),
(3, 1, 5, 'Оценка администратора');