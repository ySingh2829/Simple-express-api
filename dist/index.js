"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = new pg_1.Client({
    "user": "admin",
    "password": "password",
    "host": "172.17.0.2",
    "port": 5432,
    "database": "todos"
});
app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});
app.get("/todos", async (req, res) => {
    const todos = await readTodo();
    res.setHeader("content-type", "application/json");
    res.send(todos);
});
app.post("/todos", async (req, res) => {
    let result = {};
    try {
        const reqJson = req.body;
        await createTodo(reqJson.todo);
        result.success = true;
    }
    catch (e) {
        result.success = false;
    }
    finally {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result));
    }
});
app.delete("/todos", async (req, res) => {
    let result = {};
    try {
        const reqJson = req.body;
        await deleteTodo(reqJson.id);
        result.success = true;
    }
    catch (e) {
        result.success = false;
    }
    finally {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result));
    }
});
app.listen(8080, () => console.log("Web server is listening on port 8080"));
start();
async function start() {
    try {
        await connect();
        console.log("Connected successfully");
    }
    catch (e) {
        console.error(`${e}`);
    }
}
async function connect() {
    try {
        await client.connect();
    }
    catch (e) {
        return Promise.reject(e);
    }
}
async function readTodo() {
    try {
        const result = await client.query("SELECT id, text FROM todo");
        return result.rows;
    }
    catch (e) {
        return Promise.reject(e);
    }
}
async function createTodo(todoText) {
    try {
        await client.query("INSERT INTO todo (text) VALUES ($1)", [todoText]);
    }
    catch (e) {
        return Promise.reject(e);
    }
}
async function deleteTodo(id) {
    try {
        await client.query("DELETE FROM todo WHERE id = $1", [id]);
    }
    catch (e) {
        return Promise.reject(e);
    }
}
