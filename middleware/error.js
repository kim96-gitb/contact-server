//에러가 발생 했을때 요놈이 전담을 처리한다.
//이 에러 핸들러가 직접 클라이언트에 에러를 response
const errorHandler = function (err, req, res, next) {
  res
    .status(err.statusCode || 500)
    .json({ success: false, error: err.message || "Server Error" });
};
module.exports = errorHandler;
