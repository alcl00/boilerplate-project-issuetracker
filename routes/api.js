"use strict";
const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      let issue = req.query;

      ProjectModel.findOne({ project_name: project })
        .then((ProjectData) => {
          let issues = ProjectData.issues;

          issues = issues.filter((element) =>
            Object.keys(issue).every(
              (key) => element[key].toString() === issue[key]
            )
          );
          res.json(issues);
        })
        .catch((error) => {
          console.log(error);
        });
    })

    .post(function (req, res) {
      let project_name = req.params.project;

      ProjectModel.findOne({ project_name: project_name })
        .then((ProjectData) => {
          let project;
          if (!ProjectData) {
            project = new ProjectModel({
              project_name: project_name,
              issues: [],
            });
          } else {
            project = ProjectData;
          }
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

          if (
            !(
              newIssue.issue_title &&
              newIssue.issue_text &&
              newIssue.created_by
            )
          ) {
            res.send({ error: "required field(s) missing" });
            return;
          } else {
            project.issues.push(newIssue);
            project.save().then((data) => {
              res.json(newIssue);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })

    .put(function (req, res) {
      let project_name = req.params.project;
      let updateFields = req.body;

      if (!updateFields._id) {
        res.send({ error: "missing _id" });
      }
      if (Object.keys(updateFields).length <= 1) {
        res.send({ error: "no update field(s) sent", _id: updateFields._id });
      }

      ProjectModel.findOne({ project_name: project_name })
        .then((projectData) => {
          if (!projectData) {
            res.send({ error: "could not update", _id: updateFields._id });
            return;
          }
          let issue = projectData.issues.id(updateFields._id);
          if (!issue) {
            res.send({ error: "could not update", _id: updateFields._id });
            return;
          }
          delete updateFields._id;
          Object.keys(updateFields).forEach((key) => {
            issue[key] = updateFields[key];
          });
          issue.updated_on = new Date();
          projectData.save().then((result) => {
            res.json({ result: "successfully updated", _id: issue._id });
          });
        })
        .catch((error) => {
          res.send({ error: "could not update", _id: updateFields._id });
        });
    })

    .delete(function (req, res) {
      let project_name = req.params.project;

      if (!req.body._id) {
        res.send({ error: "missing _id" });
        return;
      }
      ProjectModel.findOne({ project_name: project_name }).then(
        (projectData) => {
          if (!projectData) {
            res.send({ error: "could not delete", _id: req.body._id });
            return;
          }
          let issue = projectData.issues.id(req.body._id);
          if (!issue) {
            res.json({ error: "could not delete", _id: req.body._id });
            return;
          }
          projectData.issues.remove(issue);
          projectData.save().then((result) => {
            res.json({ result: "successfully deleted", _id: req.body._id });
          });
        }
      );
    });
};
