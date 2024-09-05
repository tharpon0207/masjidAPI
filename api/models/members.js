const sequelize = require('../utils/database');
const { DataTypes } = require('sequelize');

const Members = sequelize.define('members', {
    system_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
    },
    member_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Member ID can't be null."
            }
        },
        unique: {
            args: true,
            msg: 'Member ID already in use!'
        }
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: { msg: "Please provide a valid email address" }
        }
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address1: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    zip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subscription: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
    },
    auto_withdrawal: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        default: 0,
        validate: {
            customValidator(value) {
                if (value < 0 || value > 1) {
                    throw new Error("auto_withdrawal can be 0 or 1");
                }
            },
            isInt: true,

        }
    },
    gender: {
        type: DataTypes.STRING(8),
        allowNull: false,
        validate: {
            isIn: {
                args: ['M', 'F'],
                msg: "Gender can be M or F"
            }
        }
    },
    share_info: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
    },
    status: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        default: 0
    },

    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'create_date',
        default: DataTypes.NOW

    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'approval_date',
        default: DataTypes.NOW
    }
});

module.exports = Members;
