const singleton = require('./singelton');
const joinRequestEvent = require('./event/joinRequest');

/**
 * @author 오해성 <alskt0419@naver.com>
 * @description 웹 소켓 서버 start
 */
exports.start = async (wss) => {
  // wss 객체 선언
  singleton.notice.setInstance(wss);

  wss.room = {};
  // 연결 이벤트 시 호출
  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ msg: 'user connected' }));

    // 메세지 이벤트 시 호출
    ws.on('message', async (message) => {
      const messageObject = JSON.parse(message);
      ws.room = [];

      // 받은 메세지 중 event 변수가 "joinRequest"일 경우 조인 시도
      // eslint-disable-next-line default-case
      switch (messageObject.event) {
        case 'joinRequest':
          joinRequestEvent.join(ws, messageObject.roomId);
      }
    });

    ws.on('error', (e) => console.log(e));
    ws.on('close', (e) => console.log(`websocket closed ${e}`));
  });
};
