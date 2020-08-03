const logger = (req, res, next) => {
  console.log(
    `${req.method}${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  next();
};
// app.use는 순서가 중요! 순서대로 실행을 시킵니다 next(함수)로
// next(함수)가 없으면 로그만 찍고 다음으로 안넘어감

module.exports = logger;
