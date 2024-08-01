import mysql from 'mysql2';
import './env.config';

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


connection.connect(err => {
  if (err) {
    console.error('MySQL 연결에러 !', err);
    return;
  }
  console.log('MySQL 연결완료 !');
});

export default connection;
