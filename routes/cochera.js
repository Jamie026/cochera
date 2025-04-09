const express = require("express");
const cocheras = express.Router();
const connection = require("../config/db");

cocheras.get("/", async (req, res) => {
    const { distrito } = req.query;
    try {
        let query = "SELECT * FROM cochera";
        let params = [];
        if (distrito) {
            query = query + " WHERE distrito LIKE ?";
            params.push("%" + distrito +"%");
        }
        const [results] = await connection.query(query, params);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener cocheras:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

cocheras.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await connection.query("SELECT * FROM cochera WHERE id = ?", [id]);
        if (results.length === 0)
            return res.status(404).json({ message: "Cochera no encontrada" });
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error al obtener cochera:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


cocheras.post("/", async (req, res) => {
    const { nombre, distrito, espacio_m2, disponible } = req.body;
    try {
        const [existing, fields] = await connection.query(
            "SELECT * FROM cochera WHERE nombre = ? AND distrito = ?",
            [nombre, distrito]
        );
        if (existing.length > 0) 
            return res.status(409).json({ message: "Ya existe una cochera con ese nombre en ese distrito" });
        await connection.query(
            "INSERT INTO cochera (nombre, distrito, espacio_m2, disponible) VALUES (?, ?, ?, ?)",
            [nombre, distrito, espacio_m2, disponible]
        );
        res.status(201).json({ message: "Cochera registrada correctamente" });
    } catch (error) {
        console.error("Error al registrar cochera:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

cocheras.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, distrito, espacio_m2, disponible } = req.body;
    try {
        const [result] = await connection.query(
            "UPDATE cochera SET nombre = ?, distrito = ?, espacio_m2 = ?, disponible = ? WHERE id = ?",
            [nombre, distrito, espacio_m2, disponible, id]
        );
        if (result.affectedRows === 0) 
            return res.status(404).json({ message: "Cochera no encontrada" });
        res.status(200).json({ message: "Cochera actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar cochera:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

cocheras.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await connection.query("DELETE FROM cochera WHERE id = ?", [id]);
        if (result.affectedRows === 0) 
            return res.status(404).json({ message: "Cochera no encontrada" });
        res.status(200).json({ message: "Cochera eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar cochera:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = cocheras;