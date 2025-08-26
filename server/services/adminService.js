const { dbManager } = require('../database/connections');
const bcrypt = require('bcryptjs');

class AdminService {
  constructor() {
    this.db = dbManager.getAdminDB();
  }

  // 관리자 목록 조회
  async getAdmins() {
    try {
      const result = await this.db.query(`
        SELECT id, username, email, mfa_enabled, password_changed_at, last_login_at, created_at 
        FROM admins 
        ORDER BY created_at DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('관리자 목록 조회 오류:', error);
      throw new Error('관리자 목록을 가져오는데 실패했습니다.');
    }
  }

  // 관리자 상세 조회
  async getAdminById(id) {
    try {
      const result = await this.db.query(
        'SELECT id, username, email, mfa_enabled, password_changed_at, last_login_at, created_at FROM admins WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('관리자 조회 오류:', error);
      throw new Error('관리자 정보를 가져오는데 실패했습니다.');
    }
  }

  // 관리자 생성
  async createAdmin(adminData) {
    try {
      const { username, email, password } = adminData;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = await this.db.query(
        'INSERT INTO admins (username, email, password, mfa_secret, mfa_enabled) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, mfa_enabled, created_at',
        [username, email, hashedPassword, null, false]
      );
      return result.rows[0];
    } catch (error) {
      console.error('관리자 생성 오류:', error);
      throw new Error('관리자 생성에 실패했습니다.');
    }
  }

  // 관리자 수정
  async updateAdmin(id, adminData) {
    try {
      const { username, email } = adminData;
      const result = await this.db.query(
        'UPDATE admins SET username = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING id, username, email, updated_at',
        [username, email, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('관리자 수정 오류:', error);
      throw new Error('관리자 수정에 실패했습니다.');
    }
  }

  // 관리자 삭제
  async deleteAdmin(id) {
    try {
      const result = await this.db.query(
        'DELETE FROM admins WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('관리자 삭제 오류:', error);
      throw new Error('관리자 삭제에 실패했습니다.');
    }
  }

  // MFA 설정
  async setupMFA(adminId, mfaSecret) {
    try {
      const result = await this.db.query(
        'UPDATE admins SET mfa_secret = $1 WHERE id = $2 RETURNING id, mfa_enabled',
        [mfaSecret, adminId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('MFA 설정 오류:', error);
      throw new Error('MFA 설정에 실패했습니다.');
    }
  }

  // MFA 활성화
  async enableMFA(adminId) {
    try {
      const result = await this.db.query(
        'UPDATE admins SET mfa_enabled = true WHERE id = $1 RETURNING id, mfa_enabled',
        [adminId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('MFA 활성화 오류:', error);
      throw new Error('MFA 활성화에 실패했습니다.');
    }
  }

  // MFA 비활성화
  async disableMFA(adminId) {
    try {
      const result = await this.db.query(
        'UPDATE admins SET mfa_enabled = false, mfa_secret = null WHERE id = $1 RETURNING id, mfa_enabled',
        [adminId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('MFA 비활성화 오류:', error);
      throw new Error('MFA 비활성화에 실패했습니다.');
    }
  }

  // 비밀번호 변경
  async changePassword(adminId, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await this.db.query(
        'UPDATE admins SET password = $1, password_changed_at = NOW() WHERE id = $2 RETURNING id, password_changed_at',
        [hashedPassword, adminId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      throw new Error('비밀번호 변경에 실패했습니다.');
    }
  }

  // 로그인 기록
  async recordLogin(adminId, success, ipAddress, userAgent) {
    try {
      const result = await this.db.query(
        'INSERT INTO admin_logs (admin_id, action, ip_address, user_agent, success) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [adminId, 'login', ipAddress, userAgent, success]
      );
      return result.rows[0];
    } catch (error) {
      console.error('로그인 기록 오류:', error);
      // 로그 기록 실패는 치명적이지 않으므로 에러를 던지지 않음
    }
  }

  // 관리자 로그 조회
  async getAdminLogs(page = 1, limit = 20, adminId = null) {
    try {
      const offset = (page - 1) * limit;
      let query = `
        SELECT al.id, al.admin_id, a.username, al.action, al.ip_address, al.user_agent, al.success, al.created_at
        FROM admin_logs al
        LEFT JOIN admins a ON al.admin_id = a.id
      `;
      let countQuery = 'SELECT COUNT(*) FROM admin_logs al';
      let params = [];

      if (adminId) {
        query += ' WHERE al.admin_id = $1';
        countQuery += ' WHERE al.admin_id = $1';
        params.push(adminId);
      }

      query += ' ORDER BY al.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);

      const [logs, countResult] = await Promise.all([
        this.db.query(query, params),
        this.db.query(countQuery, adminId ? [adminId] : [])
      ]);

      return {
        logs: logs.rows,
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      };
    } catch (error) {
      console.error('관리자 로그 조회 오류:', error);
      throw new Error('관리자 로그를 가져오는데 실패했습니다.');
    }
  }

  // 관리자 통계
  async getAdminStats() {
    try {
      const stats = await this.db.query(`
        SELECT 
          COUNT(*) as total_admins,
          COUNT(CASE WHEN mfa_enabled = true THEN 1 END) as mfa_enabled_count,
          COUNT(CASE WHEN last_login_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as active_24h,
          COUNT(CASE WHEN last_login_at >= NOW() - INTERVAL '7 days' THEN 1 END) as active_7d
        FROM admins
      `);
      return stats.rows[0];
    } catch (error) {
      console.error('관리자 통계 조회 오류:', error);
      throw new Error('관리자 통계를 가져오는데 실패했습니다.');
    }
  }

  // 보안 설정 조회
  async getSecuritySettings() {
    try {
      const result = await this.db.query('SELECT * FROM security_settings WHERE id = 1');
      return result.rows[0];
    } catch (error) {
      console.error('보안 설정 조회 오류:', error);
      throw new Error('보안 설정을 가져오는데 실패했습니다.');
    }
  }

  // 보안 설정 업데이트
  async updateSecuritySettings(settings) {
    try {
      const result = await this.db.query(`
        UPDATE security_settings 
        SET ip_whitelist = $1, max_login_attempts = $2, lockout_duration = $3, updated_at = NOW()
        WHERE id = 1
        RETURNING *
      `, [settings.ipWhitelist, settings.maxLoginAttempts, settings.lockoutDuration]);
      return result.rows[0];
    } catch (error) {
      console.error('보안 설정 업데이트 오류:', error);
      throw new Error('보안 설정 업데이트에 실패했습니다.');
    }
  }
}

module.exports = AdminService; 