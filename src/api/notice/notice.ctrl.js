const jwtDecode = require('jwt-decode');
const models = require('../../models');
const socketNotice = require('../../socket/singelton/index').notice;
const file = require('../../lib/file');

/**
 * @author 오해성 <alskt0419@naver.com>
 * @description 최신 공지사항 데이터 가져오기
 * @returns {Object} 공지사항 리스트
 */
exports.getNewNotice = async (req, res) => {
  const { roomId } = req.query;

  try {
    // 최신 데이터 조회
    const noticeData = await models.Notice.getNewNotice(roomId);

    const result = {
      status: 200,
      message: '공지 리스트',
      data: {
        noticeData,
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

/**
 * @author 오해성 <alskt0419@naver.com>
 * @description 공지사항 작성
 */
exports.writeNotice = async (req, res) => {
  const { contents, roomId } = req.body;
  const token = req.headers['x-access-token'];

  // token  여부 확인
  if (!token) {
    const result = {
      status: 400,
      message: 'token null',
    };

    res.status(400).json(result);

    return;
  }

  let writer = null;

  // 공지사항이 image인지 text인지 type 정하는 변수
  let type;
  try {
    // token 복호화
    const tokenPayload = jwtDecode(token);
    writer = tokenPayload.memberId;

    // 파일이 null일 경우 text 공지사항 저장
    if (!req.files[0]) {
      type = 1;

      // 해당 room event메세지 보내기
      const instance = socketNotice.getInstance();
      try {
        instance.room[roomId].forEach((ws) => {
          ws.send(`${roomId} : notice`);
        });
      } catch (ex) {
        console.log(`[SOCKET] Check Out Room: DID가 연결되지 않았을 가능성이 있습니다.\n${ex}`);
        const result = {
          status: 404,
          message: 'Socket이 해당 room에 접속되지 않았습니다.',
        };

        res.status(404).json(result);

        return;
      }

      await models.Notice.writeNotice(contents, writer, roomId, type);

      const result = {
        status: 200,
        message: '공지사항 작성 성공',
      };

      res.status(200).json(result);

      return;
    }

    // 파일이 null이 아닐경우 image 공지사항 저장
    type = 0;

    // 해당 room event메세지 보내기
    const instance = socketNotice.getInstance();
    try {
      instance.room[roomId].forEach((ws) => {
        ws.send(`${roomId} : notice`);
      });
    } catch (ex) {
      console.log(`[SOCKET] Check Out Room: DID가 연결되지 않았을 가능성이 있습니다.\n${ex}`);
      const result = {
        status: 404,
        message: 'Socket이 해당 room에 접속되지 않았습니다.',
      };

      res.status(404).json(result);

      return;
    }

    await models.Notice.writeNotice(req.files[0].filename, writer, roomId, type);

    const result = {
      status: 200,
      message: '공지사항 작성 성공',
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    // 서버 에러시 업로드 파일 삭제
    file.deleteUploadFiles(req.files);

    const result = {
      status: 500,
      message: '서버 에러',
    };

    res.status(500).json(result);
  }
};

/**
 * @author 오해성 <alskt0419@naver.com>
 * @description 공지사항 삭제
 */
exports.deleteNotice = async (req, res) => {
  const { noticeId } = req.query;

  try {
    // 삭제할 공지사항 불러오기
    const noticeData = await models.Notice.getNotice(noticeId);
    const { roomId } = noticeData.dataValues;

    // 해당 room event메세지 보내기
    const instance = socketNotice.getInstance();
    try {
      instance.room[roomId].forEach((ws) => {
        ws.send(`${roomId} : notice`);
      });
    } catch (ex) {
      console.log(`[SOCKET] Check Out Room: DID가 연결되지 않았을 가능성이 있습니다.\n${ex}`);
      const result = {
        status: 404,
        message: 'Socket이 해당 room에 접속되지 않았습니다.',
      };

      res.status(404).json(result);

      return;
    }

    // type에 따른 공지사항 삭제 1 == text , 0 == image
    if (noticeData.dataValues.type) {
      await models.Notice.deleteNotice(noticeId);
    } else {
      await file.deleteDbFile(noticeId);
      await models.Notice.deleteNotice(noticeId);
    }

    const result = {
      status: 200,
      message: '공지사항 삭제 성공',
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
