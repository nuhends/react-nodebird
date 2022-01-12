// sequelize에서는 table을 모델이라고 부름
module.exports = (sequelize, DataTypes) => {
  // MySql에는 'User'가 소문자 + 복수화가 되어 저장 -> users
  const User = sequelize.define('User', { 
    // MySql에서 id는 자동으로 생성
    // id: {},
    email: {
      type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
      allowNull: false,
      unique: true, // 고유한 값
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    password: {
      // 비밀번호는 암호화를 하게 되는데, 길이가 늘어남
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    // MySQL은 1개의 컬럼에 1개의 정보가 들어가야 하므로 아래는 잘못되었음
    // PostId: 1, 2, 3, 4, 5
    // CommentId: 4, 11, 15, 21
  }, 
  // User모델에 대한 config
  {
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글 저장
  });
  User.associate = (db) => {
    db.User.hasMany(db.Post);  // user.addPosts, user.getPosts
    db.User.hasMany(db.Comment);  // user.addComments, user.getComments
    
    db.User.belongsToMany(  // user.addLikers, user.removeLikers
      db.Post, 
      // 중간 테이블의 이름, User가 좋아요를 누른 Post
      { through: 'Like', as: 'Liked' }
    );

    // foreignKey 컬럼의 이름을 바꿔줌
    db.User.belongsToMany(  // user.addFollowers, user.removeFollowers
      db.User, 
      { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
    
    db.User.belongsToMany(  // user.addFollowings, user.removeFollowings
      db.User, 
      { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' },
    );
  };


  return User;
};
