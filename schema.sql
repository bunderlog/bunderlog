CREATE TABLE IF NOT EXISTS logs (
  id         TEXT     PRIMARY KEY,
  ts         INTEGER  NOT NULL,
  level      TEXT     NOT NULL,
  service    TEXT     NOT NULL,
  message    TEXT     NOT NULL,
  meta       TEXT,
  ip         TEXT,
  country    TEXT,
  ray        TEXT,
  ingest_ts  INTEGER  NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ts        ON logs(ts DESC);
CREATE INDEX IF NOT EXISTS idx_level     ON logs(level);
CREATE INDEX IF NOT EXISTS idx_service   ON logs(service);
CREATE INDEX IF NOT EXISTS idx_svc_level ON logs(service, level, ts DESC);
