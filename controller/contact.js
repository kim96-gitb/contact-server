const connetion = require("../mysql-connetion");
const ErrorRespones = require("../util/error");

// 모든 데이터를 다 가져와서 클라이언트한테 보내는것은
//  문제가 있습니다 데이터를 모두 다 보내지 않고, 끊어서 보내야 함
// 현업에서는 20~30개씩 끊어서 보냄

// @desc 모든정보를 다 조회
// @route GET/api/v1/contact?offset=0limit=20
// @access Pulic
exports.selectContact = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;

  let getdata = `select * from contact limit ${offset}, ${limit}`;
  try {
    [rows, fields] = await connetion.query(getdata);
    let count = rows.length;
    res.status(200).json({ sucess: true, item: rows, count: count });
  } catch (e) {
    next(new ErrorRespones("조회할때 에러났음", 400));
  }
};
// @desc  데이터 추가
// @route POST/api/v1/contact/:id
// @access Pulic
exports.addContact = async (req, res, next) => {
  let person_name = req.body.name;
  let phone_number = req.body.phone;
  let data = [person_name, phone_number];
  let insert = "insert into contact(person_name,phone_number) values ?";
  try {
    [rows, fields] = await connetion.query(insert, [[data]]);
    res.status(200).json({ sucess: true });
  } catch (e) {
    return next(new ErrorRespones("조회할때 에러났음", 400));
  }
};
// @desc  데이터 수정
// @route PUT/api/v1/contact/:id
// @access Pulic
exports.updateContact = async (req, res, next) => {
  let id = req.params.id;
  let person_name = req.body.name;
  let phone_number = req.body.phone;
  let data = [person_name, phone_number, id];
  let update =
    "update contact set person_name = ?, phone_number = ? where id = ?  ";
  try {
    [rows, fields] = await connetion.query(update, data);
    res.status(200).json({ sucess: true });
  } catch (e) {
    return next(new ErrorRespones("조회할때 에러났음", 400));
  }
};

// @desc  데이터 삭제
// @route DELETE/api/v1/contact/:id
// @access Pulic
exports.deleteContact = async (req, res, next) => {
  let id = req.params.id;
  let del = "delete from contact where id = ?";
  try {
    [results] = await connetion.query(del, id);
    res.status(200).json({ sucess: true });
  } catch (e) {
    return next(new ErrorRespones("조회할때 에러났음", 400));
  }
};

// @desc 이름이나 전화번호로 검색하는 API
// @route GET /api/v1/contact/search?keyword=1 & 길동
exports.searchContact = async (req, res, next) => {
  let search_name = req.query.keyword;
  let search = `select * from contact where person_name like "%${search_name}%"`;
  try {
    [rows, fields] = await connetion.query(search);
    res.status(200).json({ sucess: true, items: rows });
  } catch (e) {
    next(new ErrorRespones("조회할때 에러났음", 400));
  }
};
