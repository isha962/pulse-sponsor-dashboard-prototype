INSERT INTO users (id, role) VALUES
  ('sponsor_123', 'sponsor'),
  ('admin_001', 'admin')
ON CONFLICT (id) DO NOTHING;

-- events
INSERT INTO events (id, title, start_time) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Winter Tech Mixer', NOW() + INTERVAL '10 days'),
  ('22222222-2222-2222-2222-222222222222', 'Healthcare AI Summit', NOW() + INTERVAL '20 days'),
  ('33333333-3333-3333-3333-333333333333', 'Campus Recruiting Night', NOW() + INTERVAL '30 days'),
  ('44444444-4444-4444-4444-444444444444', 'Founders + VC Fireside', NOW() + INTERVAL '40 days'),
  ('55555555-5555-5555-5555-555555555555', 'Spring Demo Day', NOW() + INTERVAL '50 days')
ON CONFLICT (id) DO NOTHING;

-- sponsor access (sponsor_123 can see 4 events)
INSERT INTO sponsor_event_access (user_id, event_id) VALUES
  ('sponsor_123', '11111111-1111-1111-1111-111111111111'),
  ('sponsor_123', '22222222-2222-2222-2222-222222222222'),
  ('sponsor_123', '33333333-3333-3333-3333-333333333333'),
  ('sponsor_123', '55555555-5555-5555-5555-555555555555')
ON CONFLICT DO NOTHING;

-- seed last 30 days metrics for those events
DO $$
DECLARE
  d DATE;
BEGIN
  FOR d IN SELECT (CURRENT_DATE - i) FROM generate_series(0, 29) AS i
  LOOP
    INSERT INTO event_metrics (event_id, date, views, rsvps, attendance)
    VALUES
      ('11111111-1111-1111-1111-111111111111', d, (50 + (random()*40)::int), (10 + (random()*10)::int), (5 + (random()*10)::int)),
      ('22222222-2222-2222-2222-222222222222', d, (30 + (random()*30)::int), (8 + (random()*8)::int), (3 + (random()*7)::int)),
      ('33333333-3333-3333-3333-333333333333', d, (20 + (random()*25)::int), (5 + (random()*7)::int), (2 + (random()*5)::int)),
      ('55555555-5555-5555-5555-555555555555', d, (40 + (random()*35)::int), (9 + (random()*9)::int), (4 + (random()*8)::int))
    ON CONFLICT (event_id, date) DO NOTHING;
  END LOOP;
END $$;
