const { dbManager } = require('./database/connections');

async function testDatabaseConnection() {
  try {
    console.log('🔍 데이터베이스 연결 테스트 시작...');
    
    // 데이터베이스 연결 초기화
    await dbManager.initialize();
    
    console.log('✅ 데이터베이스 연결 성공!');
    
    // 연결 상태 확인
    const status = await dbManager.checkConnections();
    console.log('📊 연결 상태:', status);
    
    // 연결 종료
    await dbManager.close();
    console.log('🔌 연결 종료 완료');
    
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error.message);
    console.error('상세 오류:', error);
  }
}

testDatabaseConnection(); 