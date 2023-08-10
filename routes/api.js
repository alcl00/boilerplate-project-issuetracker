'use strict';
const IssueModel = require('../models').Issue;
const ProjectModel = require('../models').Project;
const ObjectId = require('mongoose').ObjectId

module.exports = function(app) {

  app.route('/api/issues/:project')

    .get(function(req, res) {
      let project = req.params.project;

      let queries = {};
      queries['name'] = project;
      
      Object.keys(req.query).forEach((key,index) => {
        let queryName = "issues." + key
        queries[queryName] = req.query[key];
      })

      console.log(queries)
      
      ProjectModel.find(queries)
      .then(data => {
        res.json(data[0].issues);
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

      });

      if(!(newIssue.issue_title && newIssue.issue_text && newIssue.created_by)) {
        res.send({error: 'required field(s) missing'});
      }
      else {
        ProjectModel.findOne({name: project})
        .then(async function(projectData) {
          if(!projectData) {
            await ProjectModel.create({name: project, issues: [newIssue]})
          }
          else {
            
            ProjectModel.findOneAndUpdate({name: project}, {$push: {issues: newIssue}})
            .then((err, data) => {
              if(err) throw err
            })
          }
        })
        .then(async() => {
          await IssueModel.create(newIssue)
        })
        res.json(newIssue);
      }
    })

    .put(function(req, res) {
      let project = req.params.project;

    })

    .delete(function(req, res) {
      let project = req.params.project;

    });

};
