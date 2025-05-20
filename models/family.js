const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Family = sequelize.define('Family', {
    family_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relationship: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    occupation:{ 
      type: DataTypes.STRING,
    },
    education: {
      type: DataTypes.STRING,
    },
    photo_url: {
      type: DataTypes.TEXT,
    },
  }, {
    timestamps: true,
  });

  return Family;
};