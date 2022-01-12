exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    // next 사용 용도
    // 1. next에 인자로 무엇인가를 주면 error처리
    // 2. 인자를 주지 않는다면, 다음 미들웨어 실행
    next();
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
  }
};
