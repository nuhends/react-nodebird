const Sequelize = require('sequelize');
const comment = require('./comment');
const hashtag = require('./hashtag');
const image = require('./image');
const post = require('./post');
const user = require('./user');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

// sequelize가 node와 mySql을 연결
// sequelize는 내부적으로 mysql2(드라이버)를 사용
// 인자로 넣은 항목들을 mysql2(드라이버)의 설정 정보로 보내줘서 연결할 수 있게 도와줌
// 연결 성공시 sequelize 객체에 정보가 담겨있음
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Comment = comment(sequelize, Sequelize);
db.Hashtag = hashtag(sequelize, Sequelize);
db.Image = image(sequelize, Sequelize);
db.Post = post(sequelize, Sequelize);
db.User = user(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
