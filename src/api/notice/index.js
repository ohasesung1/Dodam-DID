const notice = require('express').Router();
const noticeCtrl = require('./notice.ctrl');
const upload = require('../../lib/upload');

// 공지사항 작성
notice.post('/', upload.array('image'), noticeCtrl.writeNotice);

// 최신 공지사항 불러오기
notice.get('/', noticeCtrl.getNewNotice);

// 공지사항 삭제
notice.delete('/', noticeCtrl.deleteNotice);

module.exports = notice;
