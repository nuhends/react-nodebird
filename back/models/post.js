// sequelize에서는 table을 모델이라고 부름
module.exports = (sequelize, DataTypes) => {
  // MySql에는 'Post'가 소문자 + 복수화가 되어 저장 -> posts
  const Post = sequelize.define('Post', { 
    // MySql에서 id는 자동으로 생성
    // id: {},
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // UserId: 3,
    // PostId: 6,
    // RetweetId <- belongsToMany의 as로 생성
  }, 
  // Post모델에 대한 config
  {
    // 이모티콘 쓰기 위한 포맷
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci', // 이모티콘까지 저장
  });
  Post.associate = (db) => {
    // 포스트의 작성자
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.hasMany(db.Image); // post.addImages, post.getImages
    // Post의 좋아요 누른 User
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }) // post.addLikers, post.removeLikers
    // 리트윗 관련 -> 1대다 관계
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet
  }; 

  return Post;
};
