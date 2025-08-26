-- =====================================================
-- 관리자 데이터베이스 스키마 (admin_panel_db)
-- =====================================================

-- 관리자 테이블
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mfa_secret VARCHAR(255),
    mfa_enabled BOOLEAN DEFAULT false,
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 관리자 로그 테이블
CREATE TABLE IF NOT EXISTS admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 보안 설정 테이블
CREATE TABLE IF NOT EXISTS security_settings (
    id SERIAL PRIMARY KEY,
    ip_whitelist TEXT[], -- IP 주소 배열
    max_login_attempts INTEGER DEFAULT 5,
    lockout_duration INTEGER DEFAULT 30, -- 분 단위
    password_policy JSONB DEFAULT '{"minLength": 8, "requireUppercase": true, "requireLowercase": true, "requireNumbers": true, "requireSpecialChars": true}',
    mfa_required BOOLEAN DEFAULT false,
    session_timeout INTEGER DEFAULT 1440, -- 분 단위 (24시간)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 관리자 권한 테이블
CREATE TABLE IF NOT EXISTS admin_permissions (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    permission_name VARCHAR(50) NOT NULL,
    granted BOOLEAN DEFAULT true,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by INTEGER REFERENCES admins(id),
    UNIQUE(admin_id, permission_name)
);

-- 시스템 로그 테이블
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL CHECK (level IN ('info', 'warning', 'error', 'critical')),
    category VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_category ON system_logs(category);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- =====================================================
-- 초기 데이터 삽입
-- =====================================================

-- 관리자 DB 초기 데이터
INSERT INTO admins (username, email, password) VALUES 
('admin', 'admin@example.com', '$2a$10$rQZ8K9mN2pL1vX3yW4uJ5oI6hG7fE8dC9bA0sQ1wR2tY3uI4oP5a')
ON CONFLICT (email) DO NOTHING;

INSERT INTO security_settings (ip_whitelist, max_login_attempts, lockout_duration) VALUES 
(ARRAY['127.0.0.1', '::1'], 5, 30)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 함수 생성
-- =====================================================

-- 관리자 로그 자동 기록 함수
CREATE OR REPLACE FUNCTION log_admin_action(
    p_admin_id INTEGER,
    p_action VARCHAR(50),
    p_ip_address INET,
    p_user_agent TEXT,
    p_success BOOLEAN DEFAULT true,
    p_details JSONB DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    log_id INTEGER;
BEGIN
    INSERT INTO admin_logs (admin_id, action, ip_address, user_agent, success, details)
    VALUES (p_admin_id, p_action, p_ip_address, p_user_agent, p_success, p_details)
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- 시스템 로그 함수
CREATE OR REPLACE FUNCTION log_system_event(
    p_level VARCHAR(20),
    p_category VARCHAR(50),
    p_message TEXT,
    p_details JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    log_id INTEGER;
BEGIN
    INSERT INTO system_logs (level, category, message, details, ip_address, user_agent)
    VALUES (p_level, p_category, p_message, p_details, p_ip_address, p_user_agent)
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql; 