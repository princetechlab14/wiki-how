const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || "localhost",
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
        },
        logging: false,
    }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.AdminModel = require('./adminModel')(sequelize, Sequelize, DataTypes);
db.CategoryModel = require('./categoryModel')(sequelize, Sequelize, DataTypes);
db.GameModel = require('./gameModel')(sequelize, Sequelize, DataTypes);
db.ContactUsModel = require('./contactModel')(sequelize, Sequelize, DataTypes);

db.CategoryModel.hasMany(db.GameModel, { foreignKey: "category_id", as: "games" });
db.GameModel.belongsTo(db.CategoryModel, { foreignKey: "category_id", as: "mainCategory" });
module.exports = db;