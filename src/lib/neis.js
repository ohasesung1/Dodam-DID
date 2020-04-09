const request = require('request-promise-native');
const moment = require('moment');
const neisKey = require('../../config/neis');
require('moment-timezone');

moment.tz.setDefault('Asia/Seoul');

/**
 * @author 오해성 <alskt0419@naver.com>
 * @description 학교 코드, 지역 코드 조회
 * @returns {Object} 학교 코드, 지역 코드
 */
exports.getSchoolCode = async (schoolName) => {
  let code = null;
  let divisionCode = null;
  const option = {
    url: `https://open.neis.go.kr/hub/schoolInfo?KEY=${neisKey.neis_key}&Type=json&pIndex=1&pSize=100&SCHUL_NM=${schoolName}`,
    method: 'GET',
  };

  // neis 코드 조회 API 요청
  await request.get(option, (error, res, body) => {
    if (error) throw error;

    const schoolInfo = JSON.parse(body);

    // API 호출 오류시
    if (schoolInfo.RESULT !== undefined) {
      if (schoolInfo.RESULT.CODE === 'INFO-200') {
        code = null;
      }
    } else {
      code = schoolInfo.schoolInfo[1].row[0].SD_SCHUL_CODE;
      divisionCode = schoolInfo.schoolInfo[1].row[0].ATPT_OFCDC_SC_CODE;
    }
  });

  return {
    code,
    divisionCode,
  };
};

/**
 * @author 오해성 <alskt0419@naver.com>
 * @description 학교 급식 조회
 * @returns {Object} breakfast, lunch, dinner, status, nextBreakfast
 */
exports.getSchoolMeal = async (schoolCode, divisionCode) => {
  const toDay = moment().format('YYYYMMDD');
  // eslint-disable-next-line radix
  const nextDay = parseInt(toDay) + 1;

  let breakfast = null;
  let lunch = null;
  let dinner = null;
  let status = null;
  let nextBreakfast = null;

  const option = {
    url: `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${neisKey.neis_key}&Type=json&pIndex=1&pSize=100&SD_SCHUL_CODE=${schoolCode}&ATPT_OFCDC_SC_CODE=${divisionCode}&MLSV_FROM_YMD=${toDay}&MLSV_TO_YMD=${toDay}`,
    method: 'GET',
  };

  // nsis 급식 API 호출
  await request.get(option, (error, res, body) => {
    if (error) throw error;

    const schoolMealInfo = JSON.parse(body);

    // API 호출 오류시
    if (schoolMealInfo.RESULT !== undefined) {
      if (schoolMealInfo.RESULT.CODE === 'INFO-200') {
        status = 404;
        breakfast = null;
        lunch = null;
        dinner = null;
      }
    } else {
      // 급식이 없을 경우
      if (!schoolMealInfo.mealServiceDietInfo[1].row[0]) {
        breakfast = null;
        lunch = null;
        dinner = null;
      // 주말 급식 조회
      } else if (!schoolMealInfo.mealServiceDietInfo[1].row[4]) {
        breakfast = schoolMealInfo.mealServiceDietInfo[1].row[0].DDISH_NM;
        lunch = schoolMealInfo.mealServiceDietInfo[1].row[2].DDISH_NM;
        dinner = schoolMealInfo.mealServiceDietInfo[1].row[3].DDISH_NM;
      // 평일 급식 조회
      } else {
        breakfast = schoolMealInfo.mealServiceDietInfo[1].row[0].DDISH_NM;
        lunch = schoolMealInfo.mealServiceDietInfo[1].row[2].DDISH_NM;
        dinner = schoolMealInfo.mealServiceDietInfo[1].row[4].DDISH_NM;
      }

      status = 200;
    }
  });

  const optionForNextMeal = {
    url: `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${neisKey.neis_key}&Type=json&pIndex=1&pSize=100&SD_SCHUL_CODE=${schoolCode}&ATPT_OFCDC_SC_CODE=${divisionCode}&MLSV_FROM_YMD=${nextDay}&MLSV_TO_YMD=${nextDay}`,
    method: 'GET',
  };

  // 다음날 아침 급식 조회 API
  await request.get(optionForNextMeal, (error, res, body) => {
    if (error) throw error;

    const schoolMealInfo = JSON.parse(body);

    // API 호출 오류시
    if (schoolMealInfo.RESULT !== undefined) {
      if (schoolMealInfo.RESULT.CODE === 'INFO-200') {
        status = 404;
        nextBreakfast = null;
      }
    } else {
      nextBreakfast = schoolMealInfo.mealServiceDietInfo[1].row[0].DDISH_NM;
    }
  });

  return {
    nextBreakfast,
    breakfast,
    lunch,
    dinner,
    status,
  };
};
