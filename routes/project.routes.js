const router = require("express").Router();

const mongoose = require('mongoose');

const Project = require('../models/Project.model');
const Task = require('../models/Task.model');

// Routes
// CREATE new project
router.post('/projects', (req, res, next) => {
    const { title, description } = req.body;

    const newProject = {
        title,
        description,
        tasks: []
    }

    Project.create(newProject)
        .then(response => res.status(201).json(response))
        .catch(err => {
            console.log("error creating a new project", err);
            res.status(500).json({
                message: "error creating a new project",
                error: err
            });
        })
});

// READ get list of projects
router.get('/projects', (req, res, next) => {
    Project.find()
        .populate("tasks")
        .then(response => { res.status(201).json(response) })
        .catch(err => {
            console.log("error getting the list of projects", err);
            res.status(500).json({
                message: "error getting the list of projects",
                error: err
            });
        })
});

// READ get details of a project
router.get('/projects/:projectId', (req, res, next) => {
    const { projectId } = req.params;
    console.log(projectId);

    Project.findById(projectId)
        .populate('tasks')
        .then(project => res.status(201).json(project))
        .catch(error => res.json(error));
})

// UPDATE project details
router.put('/projects/:projectId', (req, res, next) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Project.findByIdAndUpdate(projectId, req.body, { new: true })
    .then(response => { res.status(201).json(response) })
    .catch(err => {
        console.log("error updating details of the project", err);
        res.status(500).json({
            message: "error updating details of the project",
            error: err
        });
    })
})

//DELETE project
router.delete('/projects/:projectId', (req, res, next)=> {
    const {projectId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }

    Project.findByIdAndRemove(projectId)
    .then(()=> {
        res.json({message: `Project with id ${projectId} deleted successfully`})
    })
    .catch(err => {
        console.log("error deleting project", err);
        res.status(500).json({
            message: "error deleting project",
            error: err
        });
    })
})
module.exports = router;
