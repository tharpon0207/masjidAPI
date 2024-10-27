'use strict';

const bcrypt = require('bcrypt');
const util = require('util');
const Announcements = require('../models/announcements');
const { Sequelize, where } = require('sequelize');
let Op = Sequelize.Op;

module.exports = { addAnnouncement, updateAnnouncement, getAllAnnouncements }

function addAnnouncement(req, res, next) {
  let announcement = req.swagger.params.event.value;
  //req.body.member_id
  let newAnnouncement = {
    date: announcement.date,
    title: announcement.title,
  };
  if (announcement.start !== null) {
    newAnnouncement.start = announcement.start;
  };
  if (announcement.end !== null) {
    newAnnouncement.end = announcement.end;
  };
  if (announcement.description !== null) {
    newAnnouncement.description = announcement.description;
  };
  if (announcement.publish !== null) {
    newAnnouncement.publish = announcement.publish;
  };
  if (announcement.status !== null) {
    newAnnouncement.status = announcement.status;
  };
  //console.log(newAnnouncement);
  Announcements.create(newAnnouncement)
    .then(data => {
      if (data !== null) {
        Announcements.findOne({
          where: { title: announcement.title, date: Sequelize.fn('DATE', announcement.date) },
          order: [
            ['id', 'DESC'],
            ['created_at', 'DESC'],
          ],
          attributes: ['id', [Sequelize.fn('CONCAT_WS', ',', Sequelize.fn('MONTHNAME', Sequelize.col('date')), Sequelize.fn('DAY', Sequelize.col('date')), Sequelize.fn('YEAR', Sequelize.col('date'))), 'date'], 'title', ['description', 'desc'], 'publish', 'status']
        })
          .then(data => {
            if (data != null) {
              res.json({ error: false, announcement: data });
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
function updateAnnouncement(req, res, next) {
  let announcement = req.swagger.params.event.value;
  //req.body.member_id
  let newAnnouncement = {
    date: announcement.date,
    title: announcement.title,
  };
  if (announcement.description !== null) {
    newAnnouncement.description = announcement.description;
  };
  if (announcement.publish !== null) {
    newAnnouncement.publish = announcement.publish;
  };
  if (announcement.status !== null) {
    newAnnouncement.status = announcement.status;
  };
  //console.log(newAnnouncement);
  Announcements.update(newAnnouncement,
    {
      where: {
        id: announcement.id
      },
    },
  ).then(data => {
    if (data !== null) {
      Announcements.findOne({
        where: { id: announcement.id },
        attributes: ['id', [Sequelize.fn('CONCAT_WS', ',', Sequelize.fn('MONTHNAME', Sequelize.col('date')), Sequelize.fn('DAY', Sequelize.col('date')), Sequelize.fn('YEAR', Sequelize.col('date'))), 'date'], 'title', ['description', 'desc'], 'publish', 'status']
      })
        .then(data => {
          if (data != null) {
            console.log(data);
            res.json({ error: false, announcement: data });
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

function getAllAnnouncements(req, res, next) {
  let offset = req.swagger.params.offset.value;
  let limit = parseInt(req.swagger.params.limit.value);


  Announcements.findAndCountAll({
    order: [
      ['date', 'ASC'],
    ],
    attributes: ['id', [Sequelize.fn('CONCAT_WS', ', ', Sequelize.fn('MONTHNAME', Sequelize.col('date')), Sequelize.fn('DAY', Sequelize.col('date')), Sequelize.fn('YEAR', Sequelize.col('date'))), 'date'], 'title', ['description', 'desc'], 'publish', 'status'],
    offset: offset,
    limit: limit,
  })
    .then(data => {
      if (data != null) {
        let total = (data.count % limit == 0) ? data.count / limit : parseInt(data.count / limit) + 1;
        res.json({ error: false, count: data.count, total_page: total, offset: offset, limit: limit, announcements: data.rows });
      } else {
        res.status(204).send();
      }
    }).catch(err => {
      res.status(204).send({ message: err.message || "some error occured while processing the request" });
    }
    );
}