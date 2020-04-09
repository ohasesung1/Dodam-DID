const api = require('express').Router();
const notice = require('./notice');
const member = require('./member');
const school = require('./school');

api.use('/notice', notice);
api.use('/member', member);
api.use('/school', school);

module.exports = api;
