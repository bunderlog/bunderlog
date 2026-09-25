-- Visitors' page events and the waitlist; conversion = waitlist rows / distinct visitors with a 'view'.
CREATE TABLE events (
	id       INTEGER PRIMARY KEY,
	ts       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	visitor  TEXT    NOT NULL,
	variant  TEXT    NOT NULL,
	type     TEXT    NOT NULL,
	forced   INTEGER NOT NULL DEFAULT 0,
	source   TEXT    NOT NULL DEFAULT 'direct',
	medium   TEXT,
	campaign TEXT,
	referrer TEXT,
	country  TEXT
);
CREATE INDEX events_type_variant ON events (type, variant, ts);

CREATE TABLE waitlist (
	id        INTEGER PRIMARY KEY,
	ts        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	email     TEXT    NOT NULL UNIQUE COLLATE NOCASE,
	token     TEXT    NOT NULL UNIQUE,
	visitor   TEXT,
	variant   TEXT    NOT NULL,
	forced    INTEGER NOT NULL DEFAULT 0,
	test      INTEGER NOT NULL DEFAULT 0,
	source    TEXT    NOT NULL DEFAULT 'direct',
	medium    TEXT,
	campaign  TEXT,
	country   TEXT,
	role      TEXT,
	team_size TEXT,
	pain      TEXT
);
