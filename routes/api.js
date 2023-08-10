'use strict';
const mongoose = require("mongoose");
const { Project } = require("../models");
const IssueModel = require('../models').Issue;
const ProjectModel = require('../models').Project;

module.exports = function(app) {

  app.route('/api/issues/:project')

    .get(function(req, res) {
      let project = req.params.project;
      console.log(project);
      ProjectModel.findOne({name: project})
      .then(data => {
        res.send(data.issues);
      });
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

      });

      if(!(newIssue.issue_title && newIssue.issue_text && newIssue.created_by)) {
        res.send({error: 'required field(s) missing'});
      }
      else {
        ProjectModel.findOne({name: project})
        .then(async projectData => {
          if(!projectData) {
            let newProject = await ProjectModel.create({name: project});
            newProject.issues.push(newIssue);
            newProject.save((error, savedIssue) => {
              if(err || !savedIssue) {
                res.json("Error adding issue")
              }
            })
          }
          else {
            projectData.issues.push(newIssue);
          }
        })
        .then(async function(){
          await IssueModel.create(newIssue);

          res.json(newIssue);
          //res.send(newIssue);
        })

      }
    })

    .put(function(req, res) {
      let project = req.params.project;

    })

    .delete(function(req, res) {
      let project = req.params.project;

    });

};
