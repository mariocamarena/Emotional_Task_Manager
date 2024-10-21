const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const DiaryEntry = sequelize.define('DiaryEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: Sequelize.NOW,
    allowNull: false
  },
  entry: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  emotionFeedback: {
    type: DataTypes.STRING,
    allowNull: true 
  }
});

sequelize.sync();

module.exports = DiaryEntry;
