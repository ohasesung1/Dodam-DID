module.exports = (sequelize, DataTypes) => {
  const notice = sequelize.define('notice', {
    roomId: {
      field: 'roomId',
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    type: {
      field: 'type',
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    contents: {
      field: 'contents',
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    writer: {
      field: 'writer',
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    date: {
      field: 'date',
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  }, {
    tableName: 'notice',
    timestamps: false,
  });

  notice.getNewNotice = (roomId) => notice.findAll({
    where: { roomId },
    order: [['id', 'DESC']],
    raw: true,
  });

  notice.writeNotice = (contents, writer, roomId, type) => notice.create({
    contents,
    writer,
    roomId,
    type,
  });

  notice.deleteNotice = (noticeId) => notice.destroy({
    where: {
      id: noticeId,
    },
  });

  notice.modifyNotice = (noticeId, contetns) => notice.update({
    contetns,
  }, {
    where: {
      id: noticeId,
    },
  });

  notice.getNotice = (noticeId) => notice.findOne({
    attuributes: ['id', 'room', 'contents', 'writer', 'type', 'date'],
    where: {
      id: noticeId,
    },
  });

  notice.getWriterNotice = (writer) => notice.findAll({
    attuributes: ['id', 'room', 'contents', 'writer', 'type', 'date'],
    where: {
      writer,
    },
  });

  return notice;
};
