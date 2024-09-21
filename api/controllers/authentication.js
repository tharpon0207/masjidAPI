'use strict';

var util = require('util');
const Users = require('../models/users');
const { Sequelize, where } = require('sequelize');

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

module.exports = { getToken }

function getToken(req, res, next) {
  let userName = req.body.user_name;
  let password = req.body.password;

    Users.findOne({ where: { user_name: userName, password:password,  status: 1} })
      .then(data => {
        if (data != null) {
          console.log("TOKEN : ");
          const token = jwt.sign({id:userName}, process.env.TOKEN_SECRET,{});
          console.log(token);
          res.json({ error: false, token: data });
        } else {
          res.json({ error: true, token: "Invalid username or password" });
        }
      }).catch(err => {
        res.status(204).send({ message: err.message || "some error occured while processing the request" });
      }
      );
  }