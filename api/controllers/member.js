'use strict';

var util = require('util');
const Members = require('../models/members');
const { Sequelize, where } = require('sequelize');
const { subscribe } = require('diagnostics_channel');
let Op = Sequelize.Op;


module.exports = { getAllMembers, getMemberInfo, findMembers, addNewMember }


function getAllMembers(req, res, next) {
  Members.findAll({ attributes: { exclude: ['system_id', 'createdAt', 'updatedAt'] } })
    .then(data => {
      if (data != null) {
        res.json({ error: false, members: data });
      } else {
        res.status(204).send();
      }
    }).catch(err => {
      res.status(204).send({ message: err.message || "some error occured while processing the request" });
    }
    );
}

function getMemberInfo(req, res, next) {
  let memberId = req.swagger.params.id.value;

  Members.findOne({ where: { member_id: memberId }, attributes: { exclude: ['system_id', 'createdAt', 'updatedAt'] } })
    .then(data => {
      if (data != null) {
        res.json({ error: false, member: data });
      } else {
        res.status(204).send();
      }
    }).catch(err => {
      res.status(204).send({ message: err.message || "some error occured while processing the request" });
    }
    );
}
function findMembers(req, res, next) {
  let member = req.swagger.params.member.value;
  let whereClause = [];
  //console.log(req.swagger.params.member.value.first_name);

  if (member.member_id) {
    whereClause.push({ member_id: member.member_id });
  }
  if (member.first_name) {
    whereClause.push({ first_name: { [Op.like]: `%${member.first_name}%` } });
  }
  if (member.last_name) {
    whereClause.push({ last_name: { [Op.like]: `%${member.last_name}%` } });
  }
  if (member.email) {
    whereClause.push({ email: member.email });
  }
  if (member.phone_number) {
    whereClause.push({ phone_number: member.phone_number });
  }
  if (member.address1) {
    whereClause.push({ address1: { [Op.like]: `%${member.address1}%` } });
  }
  if (member.city) {
    whereClause.push({ city: { [Op.like]: `%${member.city}%` } });
  }
  if (member.state) {
    whereClause.push({ state: member.state });
  }
  if (member.zip) {
    whereClause.push({ zip: member.zip });
  }
  if (member.status) {
    whereClause.push({ status: member.status });
  }
  console.log(whereClause);
  Members.findAll({
    attributes: { exclude: ['system_id', 'createdAt', 'updatedAt'] },
    where: {
      [Op.and]: whereClause
    }
  })
    .then(data => {
      if (data != null) {
        res.json({ error: false, members: data });
      } else {
        res.status(204).send();
      }
    }).catch(err => {
      res.status(204).send({ message: err.message || "some error occured while processing the request" });
    }
    );
}

//TO DO
function addNewMember(req, res, next) {
  let member = req.swagger.params.member.value;
  //req.body.member_id
  let newMember = {
    member_id: member.member_id,
    first_name: member.first_name,
    last_name: member.last_name,
    phone_number: member.phone_number,
    address1: member.address1,
    city: member.city,
    state: member.state,
    zip: member.zip,
    subscription: member.subscription,
    gender: member.gender,
    share_info: member.share_info,
    auto_withdrawal: member.auto_withdrawal
  };
  if (member.email !== null) {
    newMember.email = member.email;
  };
  if (member.address2 !== null) {
    newMember.address2 = member.address2;
  };
  if (member.status !== null) {
    newMember.status = member.status;
  };
  if (member.create_date !== null) {
    newMember.create_date = member.create_date;
  };
  if (member.approval_date !== null) {
    newMember.approval_date = member.approval_date;
  };
  if (member.auto_withdrawal !== null) {
    newMember.auto_withdrawal = member.auto_withdrawal;
  };
  Members.create(newMember)
    .then(data => {
      if (data !== null) {
        Members.findOne({ where: { member_id: member.member_id }, attributes: { exclude: ['system_id', 'createdAt', 'updatedAt'] } })
          .then(data => {
            if (data != null) {
              res.json({ error: false, member: data });
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

