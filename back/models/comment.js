// sequelize에서는 table을 모델이라고 부름
module.exports = (sequelize, DataTypes) => {
  // MySql에는 'Comment'가 소문자 + 복수화가 되어 저장 -> Comments
  const Comment = sequelize.define('Comment', { 
    // MySql에서 id는 자동으로 생성
    // id: {},
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // belongsTo의 기능
    // 해당 모델에 user_id, post_id 컬럼을 만들어줌
    // UserId: 3,
    // PostId: 6,
  }, 
  // Comment모델에 대한 config
  {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci', // 한글 저장
  });
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  };

  return Comment;
};
