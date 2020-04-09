const neis = require('../../lib/neis');

/**
 * @author 오해성 <alskt0419@naver.com>
 * @description 학교 코드 조회
 * @returns {Object} 학교 코드, 지역 코드
 */
exports.getSchoolCode = async (req, res) => {
  const { schoolClass, schoolName } = req.body;

  if (!schoolName) {
    const result = {
      status: 400,
      message: '학교 이름을 적어주세요!',
    };

    res.status(400).json(result);

    return;
  }

  if (!schoolClass) {
    const result = {
      status: 400,
      message: '학반을 적어주세요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    // 학교 코드 조회 lib 호출
    const schoolCode = await neis.getSchoolCode(encodeURI(schoolName));

    if (schoolCode.code === null) {
      const result = {
        status: 404,
        message: '학교 정보를 불러오지 못했습니다.',
        data: {
          schoolCode,
        },
      };

      res.status(404).json(result);

      return;
    }

    // 학교 코드와 각 반 이름 합치기 ex) 학교코드 + 2-1(roomId)
    const code = schoolCode.code + schoolClass;

    const result = {
      status: 200,
      message: '학교 코드 조회 성공',
      data: {
        code,
        divisionCode: schoolCode.divisionCode,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

/**
 * @author 오해성 <alskt0419@naver.com>
 * @description 학교 급식 조회
 * @returns {Object} 학교 급식
 */
exports.getSchoolMeal = async (req, res) => {
  const { divisionCode, schoolCode } = req.body;

  if (!divisionCode) {
    const result = {
      status: 400,
      message: '교육청 코드를 입력하세요!',
    };

    res.status(400).json(result);

    return;
  }

  if (!schoolCode) {
    const result = {
      status: 400,
      message: '학교 코드를 입력하세요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    // 학교 급식 가져오는 lib 호출 매개변수 = (학교 코드, 지역 코드)
    const mealData = await neis.getSchoolMeal(schoolCode, divisionCode);
    const {
      breakfast, lunch, dinner, nextBreakfast,
    } = mealData;

    // 조회 실패 시
    if (mealData.status === 404) {
      const result = {
        status: 404,
        message: '급식 없음',
        data: {
          breakfast,
          lunch,
          dinner,
          nextBreakfast,
        },
      };

      res.status(404).json(result);

      return;
    }

    const result = {
      status: 200,
      message: '급식조회 성공!',
      data: {
        breakfast,
        lunch,
        dinner,
        nextBreakfast,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};
