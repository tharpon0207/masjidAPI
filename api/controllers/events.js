'use strict';

const bcrypt = require ('bcrypt');
const util = require('util');
const Events = require('../models/events');
const { Sequelize, where } = require('sequelize');
let Op = Sequelize.Op;

module.exports = { addEvent , getAllEvents}

function addEvent(req, res, next) {
    let event = req.swagger.params.event.value;
    //req.body.member_id
    let newEvent = {
      date: event.date,
      title: event.title,
    };
    if (event.start !== null) {
        newEvent.start = event.start;
    };
    if (event.end !== null) {
        newEvent.end = event.end;
    };
    if (event.description !== null) {
        newEvent.description = event.description;
    };
    if (event.publish !== null) {
        newEvent.publish = event.publish;
    };
    if (event.status !== null) {
        newEvent.status = event.status;
    };
    //console.log(newEvent);
    Events.create(newEvent)
      .then(data => {
        if (data !== null) {
            Events.findOne({ where: { title: event.title }, attributes: ['id',[Sequelize.fn('MONTHNAME',Sequelize.col('date')),'month'], [Sequelize.fn('DAY',Sequelize.col('date')),'day'],'start','end','title',['description', 'desc'],'publish','status'] })
            .then(data => {
              if (data != null) {
                //data.month = (data.month).substring(0, 3);
               console.log(data);
                res.json({ error: false, event: data });
              } else {
                res.status(500).send("some error occured while processing the request");
              }
            }).catch(err => {
              res.status(204).send({ message: err.message || "some error occured while processing the request" });
            }
            );
        } else {
          res.status(500).send("some error occured while processing the request");
        }
      }).catch(err => {
        res.status(500).send({ message: err.message || "some error occured while processing the request" });
      }
      );
  }

function getAllEvents(req, res, next) {
    let o = req.swagger.params.offset.value;
    let l = parseInt(req.swagger.params.limit.value);
  
  
    Members.findAndCountAll({
      attributes: { exclude: ['system_id'] }, offset: o,
      limit: l,
    })
      .then(data => {
        if (data != null) {
          let total = (data.count % l == 0) ? data.count / l : parseInt(data.count / l) + 1;
          res.json({ error: false, count: data.count, total_page: total, offset: o, limit: l, members: data.rows });
        } else {
          res.status(204).send();
        }
      }).catch(err => {
        res.status(204).send({ message: err.message || "some error occured while processing the request" });
      }
      );
  }