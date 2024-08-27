import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, errors, json } = format;

// 로그 출력 형식 정의
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// winston 로거 생성
const logger = createLogger({
  level: 'info',  // 로그 레벨 설정
  format: combine(
    errors({ stack: true }),  // 스택 추적을 포함하여 오류 처리
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // 타임스탬프 추가
    logFormat  // 위에서 정의한 포맷 사용
  ),
  transports: [
    // 콘솔에 로그 출력
    new transports.Console({
      format: combine(
        format.colorize(),  // 콘솔에 색상 추가
        logFormat
      )
    }),
    // 파일에 로그 기록
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',  // 로그 파일 경로 및 이름
      datePattern: 'YYYY-MM-DD',  // 일 단위로 로그 파일 생성
      zippedArchive: true,  // 로그 파일 압축
      maxSize: '20m',  // 최대 파일 크기 설정
      maxFiles: '14d',  // 최대 보관 기간 설정
      format: combine(
        json()  // 로그를 JSON 형식으로 저장
      )
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })  // 예외 로그 처리
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' })  // Promise 거부 로그 처리
  ]
});

export default logger;
