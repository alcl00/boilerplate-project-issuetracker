'use strict';
const IssueModel = require('../models').Issue;
const ObjectId = require('mongoose').Types.ObjectId

module.exports = function(app) {

  app.route('/api/issues/:project')

    .get(function(req, res) {
      let project = req.params.project;

      IssueModel.find({
        $and: [
          {project_name: project},
          req.query._id!== undefined ? {_id: req.query._id} : {_id: {$exists: true}},
          req.query.assigned_to !== undefined ? {assigned_to: req.query.assigned_to} : {assigned_to: {$exists: true}},
          req.query.status_text !== undefined ? {status_text: req.query.status_text} : {status_text: {$exists: true}},
          req.query.open !== undefined ? {open: req.query.open} : {open: {$exists: true}},
          req.query.issue_title !== undefined ? {issue_title: req.query.issue_title} : {issue_title: {$exists: true}},
          req.query.issue_text !== undefined ? {issue_text: req.query.issue_text} : {issue_text: {$exists: true}},
          req.query.created_on !== undefined ? {created_on: req.query.created_on} : {created_on: {$exists: true}},
          req.query.updated_on !== undefined ? {updated_on: req.query.updated_on} : {updated_on: {$exists: true}},
          req.query.created_by !== undefined ? {created_by: req.query.created_by} : {created_by: {$exists: true}},
        ]})
      .then((data) => {
        if(!data) {
          res.json({})
        }
        else {
          res.json(data)
        }
        
      })
    })

    .post(function(req, res) {
      let project = req.params.project;
      let newIssue = new IssueModel({
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        open: true,
        issue_title: req.body.issue_title || "",
        issue_text: req.body.issue_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by || "",
        project_name: project
      });

      if(!(newIssue.issue_title && newIssue.issue_text && newIssue.created_by)) {
        res.send({error: 'required field(s) missing'});
      }
      else {

        IssueModel.create(newIssue);
        res.json(newIssue);
      }
    })

    .put(function(req, res) {
      let project = req.params.project;
      
      if(req.body._id == undefined) {
        res.send({ error: 'missing _id' })
      }
      else {
        let updateFields = {}
        Object.keys(req.body).forEach((key, value) => {
          updateFields[key] = req.body[key];
        })
        console.log(updateFields);
        if(Object.keys(updateFields).length < 2) {
          res.send({ error: 'no update field(s) sent', '_id': req.body._id })
        }
        else {
          updateFields.updated_on = new Date();
          IssueModel.findByIdAndUpdate(req.body._id, updateFields, {new: true})
          .then(function(data) {  
            if(data) {
              res.send({ result: 'successfully updated', '_id': data._id })
            }
            else {
              res.send({ error: 'could not update', '_id': req.body._id })
            }
          })
          .catch(err => {
            console.log(`Error: ${err}`)
            res.send({ error: 'could not update', '_id': req.body._id })
          })
        }
      }

    })

    .delete(function(req, res) {
      let project = req.params.project;

    });

};
