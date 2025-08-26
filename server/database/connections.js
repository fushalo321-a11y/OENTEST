const { Pool } = require('pg');

// 운영 DB 설정
const mainDBConfig = {
  host: process.env.MAIN_DB_HOST || 'localhost',
  port: process.env.MAIN_DB_PORT || 5432,
  database: process.env.MAIN_DB_NAME || 'postgres', // 임시로 postgres 사용
  user: process.env.MAIN_DB_USER || 'postgres',
  password: process.env.MAIN_DB_PASSWORD || 'postgres',
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// 관리자 DB 설정
const adminDBConfig = {
  host: process.env.ADMIN_DB_HOST || 'localhost',
  port: process.env.ADMIN_DB_PORT || 5432,
  database: process.env.ADMIN_DB_NAME || 'postgres', // 임시로 postgres 사용
  user: process.env.ADMIN_DB_USER || 'postgres',
  password: process.env.ADMIN_DB_PASSWORD || 'postgres',
  max: 10, // 관리자 DB는 더 적은 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

class DatabaseManager {
  constructor() {
    this.mainDB = null;
    this.adminDB = null;
    this.initialized = false;
  }

  // 초기화
  async initialize() {
    try {
      // 먼저 postgres 데이터베이스에 연결하여 데이터베이스 존재 여부 확인
      const postgresConfig = {
        ...mainDBConfig,
        database: 'postgres'
      };
      
      const postgresPool = new Pool(postgresConfig);
      
      try {
        // 데이터베이스 존재 여부 확인
        const mainDBExists = await postgresPool.query(
          "SELECT 1 FROM pg_database WHERE datname = $1",
          [mainDBConfig.database]
        );
        
        const adminDBExists = await postgresPool.query(
          "SELECT 1 FROM pg_database WHERE datname = $1",
          [adminDBConfig.database]
        );
        
        // 데이터베이스가 존재하지 않으면 생성
        if (mainDBExists.rows.length === 0) {
          console.log(`📊 운영 데이터베이스 ${mainDBConfig.database} 생성 중...`);
          await postgresPool.query(`CREATE DATABASE ${mainDBConfig.database}`);
        }
        
        if (adminDBExists.rows.length === 0) {
          console.log(`🔐 관리자 데이터베이스 ${adminDBConfig.database} 생성 중...`);
          await postgresPool.query(`CREATE DATABASE ${adminDBConfig.database}`);
        }
        
        await postgresPool.end();
      } catch (dbError) {
        console.warn('⚠️ 데이터베이스 생성 중 오류 (이미 존재할 수 있음):', dbError.message);
        await postgresPool.end();
      }
      
      // 실제 데이터베이스에 연결
      this.mainDB = new Pool(mainDBConfig);
      this.adminDB = new Pool(adminDBConfig);
      
      // 연결 테스트
      await this.mainDB.query('SELECT 1');
      await this.adminDB.query('SELECT 1');
      
      this.initialized = true;
      console.log('✅ 데이터베이스 연결이 성공적으로 초기화되었습니다.');
      console.log(`📊 운영 DB: ${mainDBConfig.database}`);
      console.log(`🔐 관리자 DB: ${adminDBConfig.database}`);
    } catch (error) {
      console.error('❌ 데이터베이스 연결 초기화 실패:', error.message);
      throw error;
    }
  }

  // 운영 DB 연결 반환
  getMainDB() {
    if (!this.initialized) {
      throw new Error('데이터베이스가 초기화되지 않았습니다.');
    }
    return this.mainDB;
  }

  // 관리자 DB 연결 반환
  getAdminDB() {
    if (!this.initialized) {
      throw new Error('데이터베이스가 초기화되지 않았습니다.');
    }
    return this.adminDB;
  }

  // 동적 DB 연결 반환
  getDB(type) {
    switch (type) {
      case 'main':
        return this.getMainDB();
      case 'admin':
        return this.getAdminDB();
      default:
        throw new Error(`유효하지 않은 DB 타입: ${type}`);
    }
  }

  // 연결 종료
  async close() {
    if (this.mainDB) {
      await this.mainDB.end();
    }
    if (this.adminDB) {
      await this.adminDB.end();
    }
    this.initialized = false;
    console.log('🔌 데이터베이스 연결이 종료되었습니다.');
  }

  // 연결 상태 확인
  async checkConnections() {
    try {
      const mainStatus = await this.mainDB.query('SELECT 1');
      const adminStatus = await this.adminDB.query('SELECT 1');
      
      return {
        main: mainStatus ? 'connected' : 'disconnected',
        admin: adminStatus ? 'connected' : 'disconnected'
      };
    } catch (error) {
      return {
        main: 'error',
        admin: 'error',
        error: error.message
      };
    }
  }
}

// 싱글톤 인스턴스
const dbManager = new DatabaseManager();

module.exports = { dbManager, DatabaseManager }; 