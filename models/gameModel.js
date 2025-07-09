module.exports = (sequelize, Sequelize, DataTypes) => {
    const Games = sequelize.define(
        "games",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            game_url: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            logo: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            banner: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            short_desc: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            shorting: {
                type: DataTypes.INTEGER,
                defaultValue: 500,
            },
            status: {
                type: DataTypes.ENUM("Active", "InActive"),
                defaultValue: "Active",
            },
        },
        {
            paranoid: true,
            timestamps: true,
            underscored: true,
            deletedAt: "deleted_at",
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Games;
};
