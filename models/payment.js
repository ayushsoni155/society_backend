const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    payment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM('Pending', 'Completed', 'Failed'),
      defaultValue: 'Pending',
    },
    
    payment_type: {
      type: DataTypes.ENUM('Membership', 'Donation'),
    },
    verified_by_admin: { 
      type: DataTypes.BOOLEAN,
    },
    transaction_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    payment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true,
  });

  return Payment;
};