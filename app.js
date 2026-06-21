const express = require('express'),
    bodyParser = require('body-parser'),
    // In order to use PUT HTTP verb to edit item
    methodOverride = require('method-override'),
    // Mitigate XSS using sanitizer
    sanitizer = require('sanitizer'),
    app = express(),
    port = 8000

app.use(bodyParser.urlencoded({
    extended: false
}));
// https: //github.com/expressjs/method-override#custom-logic
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method;
        delete req.body._method;
        return method
    }
}));


let tasks = [
    {
        title: "Configure ECS Task Definitions for DevFlow Service",
        description: "Define JSON templates for task sizes, logging configurations, and container environments.",
        priority: "High",
        category: "DevOps",
        completed: true,
        createdAt: new Date(Date.now() - 3600000 * 4).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    },
    {
        title: "Integrate AWS ECR Push to Jenkins CI/CD pipeline",
        description: "Set up credentials and build step to tag and push production-ready docker images to ECR container registry.",
        priority: "High",
        category: "DevOps",
        completed: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    },
    {
        title: "Optimize front-end CSS for glassmorphic dark theme",
        description: "Apply harmonized HSL palettes, smooth micro-interactions, and visual status indicators.",
        priority: "Medium",
        category: "Feature",
        completed: false,
        createdAt: new Date(Date.now() - 3600000 * 1).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    },
    {
        title: "Write unit tests for task validation endpoints",
        description: "Cover express routes, schema compliance, and boundary values using Mocha and Chai.",
        priority: "Low",
        category: "Testing",
        completed: true,
        createdAt: new Date(Date.now() - 1800000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
];

/* The task list and the form are displayed */
app.get('/tasks', function (req, res) {
    res.render('tasks.ejs', {
        tasks,
        clickHandler: "func1();"
    });
})

    /* Adding an item to the task list */
    .post('/tasks/add/', function (req, res) {
        let title = sanitizer.escape(req.body.title || '').trim();
        let description = sanitizer.escape(req.body.description || '').trim();
        let priority = sanitizer.escape(req.body.priority || 'Medium');
        let category = sanitizer.escape(req.body.category || 'Feature');

        if (title !== '') {
            tasks.push({
                title,
                description,
                priority,
                category,
                completed: false,
                createdAt: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            });
        }
        res.redirect('/tasks');
    })

    /* Deletes an item from the task list */
    .get('/tasks/delete/:id', function (req, res) {
        let taskIdx = req.params.id;
        if (taskIdx !== '' && tasks[taskIdx]) {
            tasks.splice(taskIdx, 1);
        }
        res.redirect('/tasks');
    })

    /* Toggles the completion status of a task */
    .get('/tasks/toggle/:id', function (req, res) {
        let taskIdx = req.params.id;
        if (taskIdx !== '' && tasks[taskIdx]) {
            tasks[taskIdx].completed = !tasks[taskIdx].completed;
        }
        res.redirect('/tasks');
    })

    // Get a single task item and render edit page
    .get('/tasks/:id', function (req, res) {
        let taskIdx = req.params.id;
        let task = tasks[taskIdx];

        if (task) {
            res.render('edititem.ejs', {
                taskIdx,
                task,
                clickHandler: "func1();"
            });
        } else {
            res.redirect('/tasks');
        }
    })

    // Edit item in the task list 
    .put('/tasks/edit/:id', function (req, res) {
        let taskIdx = req.params.id;
        let title = sanitizer.escape(req.body.title || '').trim();
        let description = sanitizer.escape(req.body.description || '').trim();
        let priority = sanitizer.escape(req.body.priority || 'Medium');
        let category = sanitizer.escape(req.body.category || 'Feature');

        if (taskIdx !== '' && tasks[taskIdx] && title !== '') {
            tasks[taskIdx].title = title;
            tasks[taskIdx].description = description;
            tasks[taskIdx].priority = priority;
            tasks[taskIdx].category = category;
        }
        res.redirect('/tasks');
    })
    /* Redirects to the task list if the page requested is not found */
    .use(function (req, res, next) {
        res.redirect('/tasks');
    });

if (require.main === module) {
    app.listen(port, function () {
        // Logging to console
        console.log(`DevFlow Orchestrator running on http://0.0.0.0:${port}`)
    });
}
// Export app
module.exports = app;
