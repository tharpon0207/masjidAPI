'use strict';

const bcrypt = require ('bcrypt');
const util = require('util');
const Users = require('../models/users');
const { Sequelize, where } = require('sequelize');

const jwt = require('jsonwebtoken');
require("dotenv").config();


module.exports = { getToken };


const salt = "$2b$10$DTIUElO2vmp0MM2s2Ltp6O";

function encrypt(password, salt) {
  return bcrypt.hashSync(password, salt);
}
function encryptWithRandomSalt(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function isSamePassword(password, hash) {
  return bcrypt.compareSync(password, hash)
}

function getToken(req, res, next) {
  // Log the incoming request body

  let userName = req.body.user_name;
  let password = req.body.password;


  Users.findOne({ where: { user_name: userName, password:encrypt(password, salt) , status: 1 } })
    .then(data => {
      if (data != null) {
        try {
          const token = jwt.sign({ id: userName }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
          // Update User Table with new Token
          let newUser = {};
          newUser.token=token;
          newUser.status=1;
          newUser.updated_at=Sequelize.fn('NOW');
          Users.update(newUser,
            {
              where: {
                user_name: userName,
              },
            },
          ).then(data => {
            console.log(data);
          });
          // Return Token to API caller 
          res.json({ error: false, token: token });
        } catch (err) {
          res.status(500).json({ error: true, message: err });
        }
      } else {
        res.status(401).json({ error: true, message: "Invalid username or password" });
      }
    }).catch(err => {
      res.status(500).json({ error: true, message: err });
    });
}
