'use strict';

const bcrypt = require('bcrypt');
const util = require('util');
const Events = require('../models/events');
const { Sequelize, where } = require('sequelize');
let Op = Sequelize.Op;

module.exports = { addEvent, updateEvent, getAllEvents }

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
        Events.findOne({
          where: { title: event.title, date: Sequelize.fn('DATE', event.date) },
          order: [
            ['id', 'DESC'],
            ['created_at', 'DESC'],
          ],
          attributes: ['id', [Sequelize.fn('MONTHNAME', Sequelize.col('date')), 'month'], [Sequelize.fn('DAY', Sequelize.col('date')), 'day'], 'start', 'end', 'title', ['description', 'desc'], 'publish', 'status']
        })
          .then(data => {
            if (data != null) {
              res.json({ error: false, event: data });
            } else {
              res.status(500).json({ error: true, message: "some error occured while processing the request" });
            }
          }).catch(err => {
            res.status(500).json({ error: true, message: err.message || "some error occured while processing the request" });
          }
          );
      } else {
        res.status(500).send("some error occured while processing the request");
      }
    }).catch(err => {
      res.status(400).json({ error: true, message: err.message || "some error occured while processing the request" });
    }
    );
}
function updateEvent(req, res, next) {
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
  Events.update(newEvent,
    {
      where: {
        id: event.id
      },
    },
  ).then(data => {
    if (data !== null) {
      Events.findOne({
        where: { id: event.id },
        attributes: ['id', [Sequelize.fn('MONTHNAME', Sequelize.col('date')), 'month'], [Sequelize.fn('DAY', Sequelize.col('date')), 'day'], 'start', 'end', 'title', ['description', 'desc'], 'publish', 'status']
      })
        .then(data => {
          if (data != null) {
            console.log(data);
            res.json({ error: false, event: data });
          } else {
            res.status(500).json({ error: true, message: "some error occured while processing the request" });
          }
        }).catch(err => {
          res.status(500).json({ error: true, message: err.message || "some error occured while processing the request" });
        }
        );
    } else {
      res.status(500).send("some error occured while processing the request");
    }
  }).catch(err => {
    console.log(err);
    res.status(400).json({ error: true, message: err.message || "some error occured while processing the request" });
  }
  );
}

function getAllEvents(req, res, next) {
  let offset = req.swagger.params.offset.value;
  let limit = parseInt(req.swagger.params.limit.value);


  Events.findAndCountAll({
    order: [
      ['date', 'ASC'],
    ],
    attributes: ['id', [Sequelize.fn('DATE_FORMAT', Sequelize.col('date'),'%b'), 'month'], [Sequelize.fn('DAY', Sequelize.col('date')), 'day'], 'start', 'end', 'title', ['description', 'desc'], 'publish', 'status'], offset: offset,
    limit: limit,
  })
    .then(data => {
      if (data != null) {
        let total = (data.count % limit == 0) ? data.count / limit : parseInt(data.count / limit) + 1;
        res.json({ error: false, count: data.count, total_page: total, offset: offset, limit: limit, events: data.rows });
      } else {
        res.status(204).send();
      }
    }).catch(err => {
      res.status(204).send({ message: err.message || "some error occured while processing the request" });
    }
    );
}