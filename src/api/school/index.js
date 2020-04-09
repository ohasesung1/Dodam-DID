const school = require('express').Router();
const schoolCtrl = require('./school.ctrl');

// 학교 코드 조회
school.post('/code', schoolCtrl.getSchoolCode);

// 학교 급식 조회
school.post('/meal', schoolCtrl.getSchoolMeal);

module.exports = school;
