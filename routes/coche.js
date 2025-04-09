const express = require("express");
const coches = express.Router();
const connection = require("../config/db");

coches.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM coche");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener coches:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

coches.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await connection.query("SELECT * FROM coche WHERE id = ?", [id]);
        if (results.length === 0) 
            return res.status(404).json({ message: "Coche no encontrado" });
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error al obtener coche:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

coches.post("/", async (req, res) => {
    const { id_usuario, marca, modelo, patente } = req.body;
    try {
        await connection.query(
            "INSERT INTO coche (id_usuario, marca, modelo, patente) VALUES (?, ?, ?, ?)",
            [id_usuario, marca, modelo, patente]
        );
        res.status(201).json({ message: "Coche creado correctamente" });
    } catch (error) {
        console.error("Error al crear coche:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

coches.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { id_usuario, marca, modelo, patente } = req.body;
    try {
        const [result] = await connection.query(
            "UPDATE coche SET id_usuario = ?, marca = ?, modelo = ?, patente = ? WHERE id = ?",
            [id_usuario, marca, modelo, patente, id]
        );
        if (result.affectedRows === 0) 
            return res.status(404).json({ message: "Coche no encontrado" });
        res.status(200).json({ message: "Coche actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar coche:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

coches.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await connection.query("DELETE FROM coche WHERE id = ?", [id]);
        if (result.affectedRows === 0) 
            return res.status(404).json({ message: "Coche no encontrado" });
        res.status(200).json({ message: "Coche eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar coche:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = coches;