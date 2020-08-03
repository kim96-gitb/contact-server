// Error 클래스는 nodejs의 express 패키지에 들어있는
// 클래스다이를 상속하여 우리는 에러처리가 가능하다
class ErrorRespones extends Error {
  constructor(message, statusCode) {
    // 생성자
    super(message);
    this.statusCode = statusCode;
  }
}
module.exports = ErrorRespones;
