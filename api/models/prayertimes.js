const sequelize = require('../utils/database');
const { DataTypes } = require('sequelize');

const Prayertimes = sequelize.define('prayer_times', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    fajr: {
        type: DataTypes.STRING,
        allowNull: false,
        default: null,
    },
    dhuhr: {
        type: DataTypes.STRING,
        allowNull: true,
        default: null,
    },
    asr: {
        type: DataTypes.STRING,
        allowNull: false,
        default: null,
    },
    maghrib: {
        type: DataTypes.STRING,
        allowNull: true,
        default: null,
    },
    isha: {
        type: DataTypes.STRING,
        allowNull: true,
        default: null,
    },
    jummah1: {
        type: DataTypes.STRING,
        allowNull: true,
        default: null,
    },
    jummah2: {
        type: DataTypes.STRING,
        allowNull: true,
        default: null,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    },


},
    {
        timestamps: false
    });

module.exports = Prayertimes;
