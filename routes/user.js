const express = require("express")
const users = express.Router()
const connection = require("../config/db");

users.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users, fields] = await connection.query("SELECT * FROM usuario");
        const validation = users.filter(user => user.username === username && user.password === password);
        if (validation)
            res.status(401).json({ message: "Usuario o contraseña invalida" })
        else
            res.status(200).json({ message: "Login correcto" });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

users.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const [existingUsers, fields] = await connection.query("SELECT * FROM usuario WHERE username = ?", [username]);
        if (existingUsers.length > 0)
            return res.status(409).json({ message: "El nombre de usuario ya existe" });
        await connection.query("INSERT INTO usuario (username, password) VALUES (?, ?)", [username, password]);
        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = users;