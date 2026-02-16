CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('sponsor', 'admin'))
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL
);

-- sponsor_event_access: acts like "sponsor owns event"
CREATE TABLE IF NOT EXISTS sponsor_event_access (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, event_id)
);

-- daily time series metrics per event
CREATE TABLE IF NOT EXISTS event_metrics (
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INT NOT NULL DEFAULT 0,
  rsvps INT NOT NULL DEFAULT 0,
  attendance INT NOT NULL DEFAULT 0,
  PRIMARY KEY (event_id, date)
);

CREATE INDEX IF NOT EXISTS idx_event_metrics_date ON event_metrics(date);
CREATE INDEX IF NOT EXISTS idx_sponsor_access_user ON sponsor_event_access(user_id);
