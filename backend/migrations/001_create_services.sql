
CREATE TABLE IF NOT EXISTS services (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'unknown'
        CHECK (status IN ('online', 'offline', 'maintenance', 'unknown')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category
    ON services(category);

CREATE INDEX IF NOT EXISTS idx_services_status
    ON services(status);
