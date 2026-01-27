-- Supabase Database Schema for Visitor Counter
-- This file contains the SQL schema for creating the necessary tables

-- Create visitor_counters table to store aggregate statistics
CREATE TABLE IF NOT EXISTS visitor_counters (
    id SERIAL PRIMARY KEY,
    unique_visitors INTEGER DEFAULT 0 NOT NULL,
    total_page_views INTEGER DEFAULT 0 NOT NULL,
    return_visitors INTEGER DEFAULT 0 NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create visitor_logs table to store individual visit records
CREATE TABLE IF NOT EXISTS visitor_logs (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    is_new_visitor BOOLEAN DEFAULT false,
    user_agent TEXT,
    referrer TEXT,
    url TEXT,
    viewport VARCHAR(50),
    timezone VARCHAR(100),
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visitor_logs_session_id ON visitor_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_timestamp ON visitor_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_is_new_visitor ON visitor_logs(is_new_visitor);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_ip_address ON visitor_logs(ip_address);

-- Create daily_stats table for analytics
CREATE TABLE IF NOT EXISTS daily_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    unique_visitors INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    return_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for daily stats
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);

-- Insert initial record in visitor_counters if it doesn't exist
INSERT INTO visitor_counters (id, unique_visitors, total_page_views, return_visitors)
VALUES (1, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Create function to update daily stats
CREATE OR REPLACE FUNCTION update_daily_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO daily_stats (date, unique_visitors, total_page_views, return_visitors)
    VALUES (
        CURRENT_DATE,
        CASE WHEN NEW.is_new_visitor THEN 1 ELSE 0 END,
        1,
        CASE WHEN NOT NEW.is_new_visitor THEN 1 ELSE 0 END
    )
    ON CONFLICT (date) DO UPDATE SET
        unique_visitors = daily_stats.unique_visitors + CASE WHEN NEW.is_new_visitor THEN 1 ELSE 0 END,
        total_page_views = daily_stats.total_page_views + 1,
        return_visitors = daily_stats.return_visitors + CASE WHEN NOT NEW.is_new_visitor THEN 1 ELSE 0 END,
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update daily stats
DROP TRIGGER IF EXISTS trigger_update_daily_stats ON visitor_logs;
CREATE TRIGGER trigger_update_daily_stats
    AFTER INSERT ON visitor_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_stats();

-- Create function to clean old visitor logs (optional - for data retention)
CREATE OR REPLACE FUNCTION clean_old_visitor_logs(retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM visitor_logs 
    WHERE created_at < CURRENT_TIMESTAMP - (retention_days || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create RLS (Row Level Security) policies if needed
-- ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE visitor_counters ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
-- GRANT SELECT, INSERT, UPDATE ON visitor_logs TO anon;
-- GRANT SELECT, UPDATE ON visitor_counters TO anon;
-- GRANT SELECT ON daily_stats TO anon;

-- Comments for documentation
COMMENT ON TABLE visitor_counters IS 'Stores aggregate visitor statistics for the website';
COMMENT ON TABLE visitor_logs IS 'Stores individual visitor session data';
COMMENT ON TABLE daily_stats IS 'Stores daily aggregated visitor statistics';

COMMENT ON COLUMN visitor_logs.session_id IS 'Unique identifier for the visitor session';
COMMENT ON COLUMN visitor_logs.is_new_visitor IS 'True if this is the first visit from this session';
COMMENT ON COLUMN visitor_logs.user_agent IS 'Browser user agent string';
COMMENT ON COLUMN visitor_logs.referrer IS 'URL that referred the visitor to the site';
COMMENT ON COLUMN visitor_logs.viewport IS 'Browser viewport dimensions';
COMMENT ON COLUMN visitor_logs.timezone IS 'Visitor timezone';

-- Example queries for analytics
/*
-- Get total visitors for the last 30 days
SELECT 
    date,
    unique_visitors,
    total_page_views,
    return_visitors
FROM daily_stats 
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date DESC;

-- Get visitor statistics by hour for today
SELECT 
    EXTRACT(HOUR FROM timestamp) AS hour,
    COUNT(*) AS visits,
    COUNT(DISTINCT session_id) AS unique_sessions,
    SUM(CASE WHEN is_new_visitor THEN 1 ELSE 0 END) AS new_visitors
FROM visitor_logs 
WHERE DATE(timestamp) = CURRENT_DATE
GROUP BY EXTRACT(HOUR FROM timestamp)
ORDER BY hour;

-- Get top referrers
SELECT 
    referrer,
    COUNT(*) AS visits,
    COUNT(DISTINCT session_id) AS unique_visitors
FROM visitor_logs 
WHERE referrer IS NOT NULL 
    AND referrer != 'direct'
    AND timestamp >= CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY referrer
ORDER BY visits DESC
LIMIT 10;

-- Get visitor geography (if IP geolocation is implemented)
SELECT 
    timezone,
    COUNT(*) AS visits,
    COUNT(DISTINCT session_id) AS unique_visitors
FROM visitor_logs 
WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY timezone
ORDER BY visits DESC
LIMIT 10;
*/
