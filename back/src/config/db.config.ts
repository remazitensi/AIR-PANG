import mysql from 'mysql2/promise'; // promise 모듈 사용
import './env.config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,        // 최대 연결 수
  queueLimit: 0,              // 대기열 제한 (0이면 무제한)
  connectTimeout: 50000,      // 연결 타임아웃
  enableKeepAlive: true,      // keep-alive 활성화
  keepAliveInitialDelay: 10000 // 초기 keep-alive 패킷 전송 딜레이 (밀리초)
});


pool.getConnection().then(connection => {
  console.log('MySQL 연결완료 !');
  connection.release(); // 연결을 반환하여 풀에서 다시 사용할 수 있도록 함
}).catch(err => {
  console.error('MySQL 연결에러 !', err);
});

export default pool;
