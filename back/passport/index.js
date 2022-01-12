const passport = require('passport');
const local = require('./local');

const { User } = require('../models');

module.exports = () => {
  // req.login() 실행시 실행
  // session에 user정보를 다들고있기 무겁기 때문에, 
  // 쿠키와 user의 id만 서버에서 저장
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 복원시 user의 id를 통해 정보 받아옴
  // login을 한 뒤부터는 req.user에 항상 정보가 있음
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id }});
      done(null, user); // req.user에 넣어줌
    } catch (err) {
      console.error(err);
      done(error);
    }
  });

  local();
};
