// sequelize에서는 table을 모델이라고 부름
module.exports = (sequelize, DataTypes) => {
  // MySql에는 'Image'가 소문자 + 복수화가 되어 저장 -> Images
  const Image = sequelize.define('Image', { 
    // MySql에서 id는 자동으로 생성
    // id: {},
    src: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  }, 
  // Image모델에 대한 config
  {
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글 저장
  });
  Image.associate = (db) => {
    db.Image.belongsTo(db.Post);
  };

  return Image;
};
