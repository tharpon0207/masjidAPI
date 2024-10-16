const sequelize = require('../utils/database');
const { DataTypes } = require('sequelize');

const Users = sequelize.define('users', {
    user_name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "user_name can't be null."
            }
        },
        unique: {
            args: true,
            msg: 'Member ID already in use!'
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 45],
                msg: "Password must be at least 6 characters and under 45"
            }
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
        default: null,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
        default: "member",
    },
    status: {
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
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
            }
},
    {
        timestamps: false
    });

module.exports = Users;
