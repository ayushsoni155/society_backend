const sequelize = require('../config/db');
const userModel = require('./user');
const familyModel = require('./Family');
const paymentModel = require('./Payment');
const noticeModel = require('./Notice');
const documentModel = require('./document');
const queryModel = require('./query'); // Placeholder for Query model

// Initialize models
const User = userModel(sequelize);
const Family = familyModel(sequelize);
const Payment = paymentModel(sequelize);
const Notice = noticeModel(sequelize);
const Document = documentModel(sequelize);
const Query = queryModel(sequelize); // Placeholder

// Define relationships
User.hasMany(Family, { foreignKey: 'user_id' });
Family.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Notice, { foreignKey: 'createdBy' });
Notice.belongsTo(User, { foreignKey: 'createdBy' });

User.hasMany(Document, { foreignKey: 'uploadedBy' });
Document.belongsTo(User, { foreignKey: 'uploadedBy' });

// If Query model has relationships, define them here
// Example: User.hasMany(Query, { foreignKey: 'user_id' });
// Example: Query.belongsTo(User, { foreignKey: 'user_id' });

const db = { sequelize, User, Family, Payment, Notice, Document, Query };

// Test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Uncomment to sync models with the database (use with caution in production)
// (async () => {
//   try {
//     await sequelize.sync({ force: false }); // force: true will drop and recreate tables
//     console.log('Models synced with database.');
//   } catch (error) {
//     console.error('Error syncing models:', error);
//   }
// })();

module.exports = db;