"use strict";
const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      let issue = req.query;

      ProjectModel.findOne({ project_name: project })
        .then(async (ProjectData) => {
          if (!ProjectData) {
            await ProjectModel.create({ project_name: project });
            res.send([]);
            return;
          }
          let issues = ProjectData.issues;

          issues = issues.filter((element) =>
            Object.keys(issue).every(
              (key) => element[key].toString() === issue[key]
            )
          );
          res.send(issues);
          return;
        })
        .catch((error) => {
          console.log(error);
        });
    })

    .post(function (req, res) {
      let project_name = req.params.project;

      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        res.send({ error: "required field(s) missing" });
        return;
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

      ProjectModel.findOne({ project_name: project_name })
        .then((ProjectData) => {
          if (!ProjectData) {
            ProjectData = new ProjectModel({
              project_name: project_name,
              issues: [],
            });
          }
          ProjectData.issues.push(newIssue);
          return ProjectData.save();
        })
        .then((result) => {
          res.json(newIssue);
        })
        .catch((error) => {
          res.send({ error: error.message });
        });
    })

    .put(function (req, res) {
      let project_name = req.params.project;
      let updateFields = req.body;

      if (!updateFields._id) {
        res.send({ error: "missing _id" });
        return;
      }
      if (Object.keys(updateFields).length <= 1) {
        res.send({ error: "no update field(s) sent", _id: updateFields._id });
        return;
      }

      ProjectModel.findOne({ project_name: project_name })
        .then((projectData) => {
          if (!projectData) {
            throw new Error("could not update");
          }
          let issue = projectData.issues.id(updateFields._id);
          if (!issue) {
            throw new Error("could not update");
          }
          Object.keys(updateFields).forEach((key) => {
            if (updateFields[key]) issue[key] = updateFields[key];
          });
          issue.updated_on = new Date();
          return projectData.save().then();
        })
        .then((result) => {
          console.log("in final then");
          console.log(req.body._id);
          res.json({ result: "successfully updated", _id: req.body._id });
          return;
        })
        .catch((error) => {
          res.send({ error: error.message, _id: req.body._id });
        });
    })

    .delete(function (req, res) {
      let project_name = req.params.project;

      if (!req.body._id) {
        res.send({ error: "missing _id" });
        return;
      }
      ProjectModel.findOne({ project_name: project_name })
        .then((projectData) => {
          if (!projectData) {
            throw new Error("could not delete");
          }
          let issue = projectData.issues.id(req.body._id);
          if (!issue) {
            throw new Error("could not delete");
          }
          projectData.issues.remove(issue);
          return projectData.save();
        })
        .then((result) => {
          res.json({ result: "successfully deleted", _id: req.body._id });
        })
        .catch((error) => {
          res.send({ error: error.message, _id: req.body._id });
        });
    });
};
