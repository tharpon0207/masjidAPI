const sequelize = require('../utils/database');
const { DataTypes } = require('sequelize');

const Announcements = sequelize.define('announcements', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        default: null,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        default: null,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true

    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    publish: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        default: 0,
        validate: {
            customValidator(value) {
                if (value < 0 || value > 1) {
                    throw new Error("status can be 0 or 1");
                }
            },
        }
    },
    status: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        default: 1,
        validate: {
            customValidator(value) {
                if (value < 0 || value > 1) {
                    throw new Error("status can be 0 or 1");
                }
            },
        }
    }
},
    {
        timestamps: false
    });

module.exports = Announcements;
