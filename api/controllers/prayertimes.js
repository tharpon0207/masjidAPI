'use strict';

const bcrypt = require('bcrypt');
const util = require('util');
const Prayertimes = require('../models/prayertimes');
const { Sequelize, where } = require('sequelize');
let Op = Sequelize.Op;

module.exports = { getPrayerTimes, updatePrayerTime }

function getPrayerTimes(req, res, next) {
    Prayertimes.findOne({ where: { status: 1 }, attributes: { exclude: ['updated_at'] } })
        .then(data => {
            if (data != null) {
                res.json({ error: false, time: data });
            } else {
                res.status(500).json({ error: true, message: "some error occured while processing the request" });
            }
        }).catch(err => {
            res.status(204).send({ message: err.message || "some error occured while processing the request" });
        }
        );
}
function updatePrayerTime(req, res, next) {
    let times = req.swagger.params.time.value;
    //req.body.member_id
    let newTimes = {};
    if (times.fajr !== null) {
        newTimes.fajr = times.fajr;
    };
    if (times.dhuhr !== null) {
        newTimes.dhuhr = times.dhuhr;
    };
    if (times.asr !== null) {
        newTimes.asr = times.asr;
    };
    if (times.maghrib !== null) {
        newTimes.maghrib = times.maghrib;
    };
    if (times.isha !== null) {
        newTimes.isha = times.isha;
    };
    if (times.jummah1 !== null) {
        newTimes.jummah1 = times.jummah1;
    };
    if (times.jummah2 !== null) {
        newTimes.jummah2 = times.jummah2;
    };
    Prayertimes.update(newTimes,
        {
            where: {
                id: times.id
            },
        },
    ).then(data => {
        if (data !== null) {
            Prayertimes.findOne({
                where: { id: times.id }, attributes: { exclude: ['updated_at'] }
            })
                .then(data => {
                    if (data != null) {
                        res.json({ error: false, time: data });
                    } else {
                        res.status(500).json({ error: true, message: "some error occured while processing the request" });
                    }
                }).catch(err => {
                    res.status(500).json({ error: true, message: err.message || "some error occured while processing the request" });
                }
                );
        } else {
            res.status(500).json({ error: true, message: err.message || "some error occured while processing the request" });
        }
    }).catch(err => {
        res.status(400).json({ error: true, message: err.message || "some error occured while processing the request" });
    }
    );
}

