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
        validate: {
            isIn: {
                args: [['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']]
                ,
                msg: "Must be a valid US State initial (2 characters)"
            }
        }
    },
    zip: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [5, 5],
                msg: "Please provide a valid zip code length."
            },
            isNumeric: {
                args: true,
                msg: "Please provide a valid zip code."
            }
        }
    },
    subscription: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        validate: {
            customValidator(value) {
                if (value < 0) {
                    throw new Error("Subscription can not be negative!");
                }
                else if (value > 9999) {
                    throw new Error("Subscription is too large!")
                }
            },
        }
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
                msg: "Gender can only be either M or F"
            }
        }
    },
    share_info: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        validate: {
            customValidator(value) {
                if (value < 0 || value > 1) {
                    throw new Error("Would you like to share the information with others 1 for Yes, 0 for No.");
                }
            },
        }
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

    create_date: {
        type: DataTypes.DATE,
        allowNull: true

    },
    approval_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
},
    {
        timestamps: false
    });

module.exports = Members;
