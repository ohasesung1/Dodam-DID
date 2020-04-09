const member = require('express').Router();
const memberCtrl = require('./member.ctrl');

// 내가 쓴 공지사항 불러옴
member.get('/notice', memberCtrl.getWriterNotice);

module.exports = member;
