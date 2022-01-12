// sequelize에서는 table을 모델이라고 부름
module.exports = (sequelize, DataTypes) => {
  // MySql에는 'Hashtag'가 소문자 + 복수화가 되어 저장 -> Hashtags
  const Hashtag = sequelize.define('Hashtag', { 
    // MySql에서 id는 자동으로 생성
    // id: {},
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  }, 
  // Hashtag모델에 대한 config
  {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci', // 한글 저장
  });
  // hashtag와 post는 서로서로 관계를 가짐 -> 다대다 관계
  // 1개의 post에 여러 개의 hashtag가 있을 수 있음
  // 1개의 hashtag에 여러 개의 post가 있을 수 있음 
  Hashtag.associate = (db) => {
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    // cf: 일대일 관계도 있음 hasOne 
    // ex: User와 UserInfo
  };

  return Hashtag;
};
