CREATE TABLE IF NOT EXISTS transactions (
	id INTEGER PRIMARY KEY,
    description TEXT not null,
    amount INTEGER  not null,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    type_id INTEGER NOT NULL REFERENCES type_transaction(id)
);

CREATE TABLE IF NOT EXISTS categories (
	id INTEGER PRIMARY KEY,
    name TEXT NOT NULL unique
);

CREATE TABLE IF NOT EXISTS type_transaction (
	id INTEGER PRIMARY KEY,
    name TEXT not null unique
);

-- insert into type_transaction (name) values ('income'), ('expense');

-- INSERT INTO categories (name) VALUES
--     ('food'),
--     ('transport'),
--     ('entertainment'),
--     ('utilities'),
--     ('health'),
--     ('shopping'),
--     ('salary'),
--     ('other');