// eslint-disable-next-line camelcase
const jwtDecode = require('jwt-decode');
const models = require('../../models');

/**
 * @author 오해성 <alskt0419@naver.com>
 * @description 사용자가 쓴 공지사항을 불러옵니다.
 * @returns {Object} 내가 쓴 공지사항
 */
exports.getWriterNotice = async (req, res) => {
  const token = req.headers['x-access-token'];
  let writer = null;

  // token  여부 확인
  if (!token) {
    const result = {
      status: 400,
      message: 'token null',
    };

    res.status(400).json(result);

    return;
  }
  try {
    // eslint-disable-next-line camelcase
    const token_payload = jwtDecode(token);
    writer = token_payload.memberId;

    const notice = await models.Notice.getWriterNotice(writer);

    const result = {
      status: 200,
      message: '공지 리스트',
      data: {
        notice,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    const result = {
      status: 500,
      message: '서버 에러',
    };

    res.status(500).json(result);
  }
};
