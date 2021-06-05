module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // MYSQL에서는 users 테이블 생성
    // id가 기본적으로 들어있다.
    email: {
      type: DataTypes.STRING(50),
      allowNull: false, // 필수
      unique: true, // 고유한 값
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false, // 필수
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false, // 필수
    },
    introduce: {
      type: DataTypes.TEXT,
      allowNull: false, // 필수
    },
    sex: {
      type: DataTypes.STRING(10),
      allowNull: false, // 필수
    },
    age: {
      type: DataTypes.INTEGER(2),
      allowNull: false, // 필수
    },
    MBTI: {
      type: DataTypes.STRING(4),
      allowNull: false, // 필수
    },
    kakaolink: {
      type: DataTypes.STRING(100),
      allowNull: false, // 필수
    },
  }, {
    modelName: 'User',
    tableName: 'users',
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글 저장
  });

  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
  };
  return User;
}