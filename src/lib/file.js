const fs = require('fs');
const models = require('../models');

/**
 * @author 오해성 <alskt0419@naver.com>
 * @description 업로드 된 파일 삭제
 */
exports.deleteUploadFiles = async (files) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < files.length; i++) {
    fs.unlinkSync(`./public/${files[i].filename}`);
  }
};


/**
 * @author 오해성 <alskt0419@naver.com>
 * @description 업로드와 DB에 파일이름 이 저장된 파일 삭제
 */
exports.deleteDbFile = async (id) => {
  const noticeData = await models.Notice.getNotice(id);
  const filename = noticeData.dataValues.contents;
  fs.unlinkSync(`./public/${filename}`);
};
