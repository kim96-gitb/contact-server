const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");
const connection = require("../mysql-connetion");
const { userPhotoUpload } = require("../../movie-server/controllers/user");

// @desc 회원가입
// @routes POST api/v1/user
// @request email passwd
// @response success , result
exports.signupContact = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  const hashedPasswd = await bcrypt.hash(passwd, 8);

  if (!validator.isEmail(email)) {
    res.status(500).json({ success: false, msg: "아이디가 형식이 이상합니다" });
    return;
  }

  let query = `insert into contact_user(email,passwd) values("${email}","${hashedPasswd}") `;
  let user_id;
  try {
    [result] = await connection.query(query);
    user_id = result.insertId;
  } catch (e) {
    if (e.errno == 1062) {
      res.status(400).json({ success: false, msg: "이메일중복" });
    } else {
      res.status(500).json({ success: false, error: e });
      return;
    }
  }

  let token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);

  query = `insert into contact_token(token,user_id) values ("${token}",${user_id})`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, result: result });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
    return;
  }
};

// @desc 로그인
// @routes POST api/v1/user/login
// @request email passwd
// @response success , result , token
exports.loginContact = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;
  let query = `select * from contact_user where email = "${email}" `;
  try {
    [rows] = await connection.query(query);
    let savedPasswd = rows[0].passwd;
    let isMatch = await bcrypt.compare(passwd, savedPasswd);
    if (isMatch == false) {
      res.status(200).json({ success: false, result: isMatch });
      return;
    }
    let user_id = rows[0].id;
    let token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
    query = `insert into contact_token(token,user_id) values ("${token}",${user_id})`;
    try {
      [result] = await connection.query(query);
      res.status(200).json({ success: true, token: token });
    } catch (e) {
      res.status(400).json({ success: false, error: e });
    }
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// @desc 로그아웃
// @routes DELETE api/v1/user/logout
// @request token
// @response success , result , token
exports.logoutContact = async (req, res, next) => {
  let user_id = req.user.user_id;
  let token = req.user.token;
  let query = `delete from contact_token where user_id = ${user_id} and token = "${token}"`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// @desc 로그인해서 내가 저장한 연락처 확인하기
// @routes DELETE api/v1/user/me
// @request token
// @response success , result
exports.selectUser = async (req, res, next) => {
  let user_id = req.user.user_id;
  let query = `select * from contact where user_id = ${user_id}`;
  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, msg: rows });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// @desc 연락처 생성
// @routes POST api/v1/user/add
// @request token , name , phone
// @response success , result
exports.addContactUser = async (req, res, next) => {
  let user_id = req.user.user_id;
  let name = req.body.name;
  let phone = req.body.phone;
  let query = `insert into contact(name,phone,user_id) values ("${name}","${phone}",${user_id})`;

  if (!name || !phone) {
    res
      .status(500)
      .json({ success: false, msg: "이름 , 전화번호는 필수입니다" });
  }
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, msg: result });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
// @desc 연락처 수정
// @routes PUT api/v1/user/update
// @request token , name , phone
// @response success , result
exports.updateUser = async (req, res, next) => {
  let user_id = req.user.user_id;
  let name = req.body.name;
  let phone = req.body.phone;
  let contact_id = req.body.id;
  let query = `update contact set name = "${name}" , phone = "${phone}" where user_id = ${user_id} and id = ${contact_id}`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, msg: result });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
// @desc 연락처 삭제
// @routes DELETE api/v1/user/delete
// @request token , name , phone
// @response success , result
exports.deleteContactUser = async (req, res, next) => {
  let user_id = req.user.user_id;
  let name = req.body.name;
  let phone = req.body.phone;
  let query = `delete from contact where user_id = ${user_id} and name = "${name}" and phone = "${phone}" `;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, msg: result });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
// @desc 연락처 공유
// @routes POST api/v1/user/share
// @request token , contact_id , user_id , shared_id
// @response success , result
exports.sharedContact = async (req, res, next) => {
  let user_id = req.user.user_id;
  let contact_id = req.body.contact_id;
  let shared_id = req.body.shared_id;
  let query = `insert into contact_share(user_id,shared_user_id,contact_id) values (${user_id},${shared_id},${contact_id})`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, msg: result });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
// @desc 연락처 공유 취소
// @routes POST api/v1/user/share
// @request token , contact_id , user_id , shared_id
// @response success , result
exports.sharedCancel = async (req, res, next) => {
  let user_id = req.user.user_id;
  let contact_id = req.body.contact_id;
  let shared_id = req.body.shared_id;
  let query = `delete from contact_share where user_id = ${user_id} and shared_user_id = ${shared_id} and contact_id = ${contact_id}`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, msg: result });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
