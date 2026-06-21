// Requiring modules
const assert = require('assert');
const request = require('supertest');
const app = require('./app');

// We can group similar tests inside a describe block
describe("Simple Calculations", () => {
    before(() => {
        console.log("This part executes once before all tests");
    });

    after(() => {
        console.log("This part executes once after all tests");
    });
        
    // We can add nested blocks for different tests
    describe("Test1", () => {
        beforeEach(() => {
            console.log("executes before every test");
        });
        
        it("Is returning 5 when adding 2 + 3", () => {
            assert.equal(2 + 3, 5);
        });

        it("Is returning 6 when multiplying 2 * 3", () => {
            assert.equal(2 * 3, 6);
        });
    });

    describe("Test2", () => {
        beforeEach(() => {
            console.log("executes before every test");
        });
        
        it("Is returning 5 when adding 2 + 3 (corrected assertion description)", () => {
            assert.equal(2 + 3, 5);
        });

        it("Is returning 8 when multiplying 2 * 4", () => {
            assert.equal(2 * 4, 8);
        });
    });
});

describe("DevFlow App Route Tests", () => {
    it("should redirect to /tasks when accessing root /", (done) => {
        request(app)
            .get('/')
            .expect(302)
            .expect('Location', '/tasks', done);
    });

    it("should load the /tasks dashboard successfully", (done) => {
        request(app)
            .get('/tasks')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect((res) => {
                assert.ok(res.text.includes("DevFlow Orchestrator"));
                assert.ok(res.text.includes("AWS ECS"));
            })
            .end(done);
    });

    it("should add a new task", (done) => {
        request(app)
            .post('/tasks/add/')
            .type('form')
            .send({
                title: "Test ECS Cluster deployment",
                description: "Verifying routes in integration test suite.",
                priority: "High",
                category: "Testing"
            })
            .expect(302)
            .expect('Location', '/tasks', done);
    });

    it("should toggle a task's completion status", (done) => {
        request(app)
            .get('/tasks/toggle/0')
            .expect(302)
            .expect('Location', '/tasks', done);
    });

    it("should render edit page for an existing task", (done) => {
        request(app)
            .get('/tasks/0')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect((res) => {
                assert.ok(res.text.includes("Modify Orchestration Stage"));
            })
            .end(done);
    });
});
