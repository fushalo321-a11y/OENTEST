-- =====================================================
-- 운영 데이터베이스 스키마 (main_app_db)
-- =====================================================

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 게시글 테이블
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false
);

-- 신고 테이블
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    reporter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reporter_name VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by INTEGER REFERENCES users(id)
);

-- 보증사이트 테이블
CREATE TABLE IF NOT EXISTS warranty_sites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    guarantee_amount VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 이벤트 테이블
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_post_id ON reports(post_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

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

-- 운영 DB 초기 데이터
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@example.com', '$2a$10$rQZ8K9mN2pL1vX3yW4uJ5oI6hG7fE8dC9bA0sQ1wR2tY3uI4oP5a', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 관리자 DB 초기 데이터
INSERT INTO admins (username, email, password) VALUES 
('admin', 'admin@example.com', '$2a$10$rQZ8K9mN2pL1vX3yW4uJ5oI6hG7fE8dC9bA0sQ1wR2tY3uI4oP5a')
ON CONFLICT (email) DO NOTHING;

INSERT INTO security_settings (ip_whitelist, max_login_attempts, lockout_duration) VALUES 
(ARRAY['127.0.0.1', '::1'], 5, 30)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 뷰 생성 (운영 DB)
-- =====================================================

-- 사용자 통계 뷰
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count,
    COUNT(CASE WHEN last_login_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as active_24h,
    COUNT(CASE WHEN last_login_at >= NOW() - INTERVAL '7 days' THEN 1 END) as active_7d
FROM users;

-- 게시글 통계 뷰
CREATE OR REPLACE VIEW post_stats AS
SELECT 
    COUNT(*) as total_posts,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as posts_24h,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as posts_7d,
    SUM(view_count) as total_views,
    SUM(like_count) as total_likes
FROM posts WHERE is_deleted = false;

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