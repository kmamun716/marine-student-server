const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operationsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('connected successfully')
  })
  .catch(err => {
    console.log(err)
  })

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.student = require('./studentModel')(sequelize, DataTypes);
db.personal_info = require('./personalModel')(sequelize, DataTypes);
db.academic_info = require('./academicModel')(sequelize, DataTypes);
db.employment_info = require('./employmentModel')(sequelize, DataTypes);
db.others_info = require('./othersModel')(sequelize, DataTypes);

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('re sync done');
  })

// user connection with varius model
db.student.hasOne(db.personal_info, {
  foreignKey: 'student',
  as: 'personal-info'
})

db.student.hasOne(db.academic_info, {
  foreignKey: 'student',
  as: 'academic-info'
})

db.student.hasOne(db.employment_info, {
  foreignKey: 'student',
  as: 'employment-info'
})

db.student.hasOne(db.others_info, {
  foreignKey: 'student',
  as: 'others-info'
})

module.exports = db;