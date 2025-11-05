const User = require('./User');
const Salary = require('./Salary');

// Define associations
User.hasMany(Salary, { foreignKey: 'userId', as: 'salaries' });
Salary.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Salary,
  sequelize: require('../config/database')
};
