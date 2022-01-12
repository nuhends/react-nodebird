const passport = require('passport');
const bcrypt = require('bcrypt');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../models')

module.exports = () => {
  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
    }, 
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
    
        if(!user) {
          // [서버 에러, 성공, 클라이언트 에러]
          return done(null, false, { reason: '존재하지 않는 사용자입니다!' });
        }
        const result = await bcrypt.compare(password, user.password);
        
        // 로그인 성공
        if(result) {
          // callback이 실행 -> passport.authenticate('local', callback) 의 두번째 인자 callback
          return done(null, user);
        }
        // 비밀번호 오류
        return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
      } catch (err) {
        console.error(err);

        return done(error);
      }
    })
  );
};
