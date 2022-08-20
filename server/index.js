const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();

let userId;

app.use(
    cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        credentials: true,
    }),
    express.urlencoded({ extended: false })
);
const PORT = process.env.PORT || 5000;

async function start() {
    try {
        pool = await mysql.createPool({
            connectionLimit: 5,
            host: "localhost",
            user: "mysql",
            database: "todo",
            password: "",
        });
        app.listen(PORT, () => {
            console.log("Server starting is", PORT);
        });
    } catch (e) {
        console.log(e);
    }
}
start();
app.get("/api/gettoken", (req, res) => {
    pool.query(
        "SELECT _Token FROM users WHERE _EMail = ?",
        [req.query._EMail],
        function (err, data) {
            if (err) return console.log(err);
            res.send(data[0]);
        }
    );
});
app.get("/api/gettasks", (req, res) => {
    let userId = getUserId(req.query._Token);
    pool.query(
        "SELECT * FROM tasks WHERE _UserId = ?",
        [userId],
        function (err, data) {
            if (err) return console.log(err);
            res.send(data);
        }
    );
});

app.get("/api/reset", (req, res) => {
    pool.query(
        "SELECT * FROM users WHERE _Token = ? and _Position = ?",
        [req.query._Token, 2],
        function (err, data) {
            if (err) return console.log(err);
            if (data[0]) {
                pool.query("DELETE FROM `tasks`", function (err, data) {
                    if (err) return console.log(err);
                    res.send("OK");
                });
            }
        }
    );
});
app.post("/api/auth", (req, res) => {
    pool.query(
        "SELECT * FROM users WHERE _EMail = ? AND _Password = ?",
        [req.body._EMail, req.body._Password],
        function (err, data) {
            if (err) return console.log(err);
            if (data[0]) {
                const token = jwt.sign(
                    {
                        id: data[0].id,
                    },
                    "secret-code",
                    { expiresIn: 60 * 60 }
                );
                pool.query(
                    "UPDATE users SET _Token = '" +
                        token +
                        "' WHERE id = " +
                        data[0].id +
                        "",
                    function (err, data) {
                        if (err) return console.log(err);
                    }
                );
            } else {
                data.push({
                    errorMessage: "Invalid password or login",
                });
            }
            res.send(data[0]);
        }
    );
});
app.post("/api/addiction", (req, res) => {
    pool.query(
        "SELECT id FROM users WHERE _Token = ?",
        [req.body._Token],
        function (err, data) {
            if (err) return console.log(err);
            if (data[0]) {
                pool.query(
                    "INSERT INTO `tasks` (`_UserId`, `_Task`) VALUES ( ?, ? )",
                    [data[0].id, req.body._Task],
                    function (err, data) {
                        if (err) return console.log(err);
                        res.send("Ok");
                    }
                );
            } else {
                res.send("Err");
            }
        }
    );
});
app.post("/api/complete", (req, res) => {
    let userId = getUserId(req.body._Token);
    pool.query(
        "DELETE FROM `tasks` WHERE _UserId = ? AND _Task = ?",
        [userId, req.body._Task],
        function (err, data) {
            if (err) return console.log(err);
            res.send("Ok");
        }
    );
});

function getUserId(token) {
    pool.query(
        "SELECT id FROM users WHERE _Token = ?",
        [token],
        function (err, data) {
            if (err) return console.log(err);
            userId = data[0].id;
        }
    );
    return userId;
}
