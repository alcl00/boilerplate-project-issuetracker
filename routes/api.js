'use strict';
const mongoose = require("mongoose");
const IssueModel = require('../models').Issues;
const ProjectModel = require('../models').Projects;

module.exports = function(app) {

  app.route('/api/issues/:project')

    .get(function(req, res) {
      let project = req.params.project;
      res.send({});
    })

    .post(function(req, res) {
      let project = req.params.project;
      console.log(req.body);
    })

    .put(function(req, res) {
      let project = req.params.project;

    })

    .delete(function(req, res) {
      let project = req.params.project;

    });

};
