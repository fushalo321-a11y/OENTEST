const { dbManager } = require('../database/connections');

class UserService {
  constructor() {
    this.db = dbManager.getMainDB();
  }

  // 사용자 목록 조회
  async getUsers(page = 1, limit = 10, search = '') {
    try {
      const offset = (page - 1) * limit;
      let query = 'SELECT id, username, email, role, created_at, last_login_at FROM users';
      let countQuery = 'SELECT COUNT(*) FROM users';
      let params = [];

      if (search) {
        query += ' WHERE username ILIKE $1 OR email ILIKE $1';
        countQuery += ' WHERE username ILIKE $1 OR email ILIKE $1';
        params.push(`%${search}%`);
      }

      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);

      const [users, countResult] = await Promise.all([
        this.db.query(query, params),
        this.db.query(countQuery, search ? [search] : [])
      ]);

      return {
        users: users.rows,
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      };
    } catch (error) {
      console.error('사용자 목록 조회 오류:', error);
      throw new Error('사용자 목록을 가져오는데 실패했습니다.');
    }
  }

  // 사용자 상세 조회
  async getUserById(id) {
    try {
      const result = await this.db.query(
        'SELECT id, username, email, role, created_at, last_login_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('사용자 조회 오류:', error);
      throw new Error('사용자 정보를 가져오는데 실패했습니다.');
    }
  }

  // 사용자 생성
  async createUser(userData) {
    try {
      const { username, email, password, role = 'user' } = userData;
      const result = await this.db.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, created_at',
        [username, email, password, role]
      );
      return result.rows[0];
    } catch (error) {
      console.error('사용자 생성 오류:', error);
      throw new Error('사용자 생성에 실패했습니다.');
    }
  }

  // 사용자 수정
  async updateUser(id, userData) {
    try {
      const { username, email, role } = userData;
      const result = await this.db.query(
        'UPDATE users SET username = $1, email = $2, role = $3, updated_at = NOW() WHERE id = $4 RETURNING id, username, email, role, updated_at',
        [username, email, role, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('사용자 수정 오류:', error);
      throw new Error('사용자 수정에 실패했습니다.');
    }
  }

  // 사용자 삭제
  async deleteUser(id) {
    try {
      const result = await this.db.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('사용자 삭제 오류:', error);
      throw new Error('사용자 삭제에 실패했습니다.');
    }
  }

  // 사용자 통계
  async getUserStats() {
    try {
      const stats = await this.db.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
          COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count,
          COUNT(CASE WHEN last_login_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as active_24h,
          COUNT(CASE WHEN last_login_at >= NOW() - INTERVAL '7 days' THEN 1 END) as active_7d
        FROM users
      `);
      return stats.rows[0];
    } catch (error) {
      console.error('사용자 통계 조회 오류:', error);
      throw new Error('사용자 통계를 가져오는데 실패했습니다.');
    }
  }
}

module.exports = UserService; 