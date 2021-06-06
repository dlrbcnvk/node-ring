module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false, // 필수
    },
  }, {
    modelName: 'Post',
    tableName: 'posts',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  });
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // post.addLikers(), post.removeLikers()
  };
  return Post;
}