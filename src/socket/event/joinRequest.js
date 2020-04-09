const noticeSocket = require('../singelton/').notice;

/**
 * @author 오해성 <alskt0419@naver.com>
 * @description room 조인
 */
exports.join = async (ws, roomId) => {
  const noticeInstance = noticeSocket.getInstance();

  ws.room = [];

  // room 조인 시키기
  if (noticeInstance.room[roomId] != null && Array.isArray(noticeInstance.room[roomId])) {
    noticeInstance.room[roomId].push(ws);
    ws.room.push(roomId);
  } else {
    noticeInstance.room[roomId] = [ws];
  }

  // 조인 성공시 메세지 보내기
  ws.send(JSON.stringify({
    event: 'joinResponse',
    message: 'Joined room',
    data: {
      roomId,
    },
  }));
};
