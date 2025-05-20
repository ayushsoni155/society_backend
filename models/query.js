const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Query = sequelize.define('Query', {
    query_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Open', 'Resolved', 'Closed'),
      defaultValue: 'Open',
    },
  }, {
    timestamps: true,
  });

  return Query;
};