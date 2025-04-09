const express = require("express");
const reservas = express.Router();
const connection = require("../config/db");

reservas.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM reserva");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

reservas.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await connection.query("SELECT * FROM reserva WHERE id = ?", [id]);
        if (results.length === 0)
            return res.status(404).json({ message: "Reserva no encontrada" });
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error al obtener reserva:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

reservas.post("/", async (req, res) => {
    const { id_usuario, id_cochera, fecha_inicio, fecha_fin } = req.body;
    try {
        const [usuarios] = await connection.query("SELECT * FROM usuario WHERE id = ?", [id_usuario]);
        const [cocheras] = await connection.query("SELECT * FROM cochera WHERE id = ?", [id_cochera]);
        if (usuarios.length === 0 || cocheras.length === 0) 
            return res.status(404).json({ message: "Usuario o cochera no registrada" });
        await connection.query(
            "INSERT INTO reserva (id_usuario, id_cochera, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)",
            [id_usuario, id_cochera, fecha_inicio, fecha_fin]
        );
        res.status(201).json({ message: "Reserva creada exitosamente" });
    } catch (error) {
        console.error("Error al crear reserva:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

reservas.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { fecha_inicio, fecha_fin, estado } = req.body;
    try {
        await connection.query(
            "UPDATE reserva SET fecha_inicio = ?, fecha_fin = ?, estado = ? WHERE id = ?",
            [fecha_inicio, fecha_fin, estado, id]
        );
        res.status(200).json({ message: "Reserva actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar reserva:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

reservas.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query("DELETE FROM reserva WHERE id = ?", [id]);
        res.status(200).json({ message: "Reserva eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar reserva:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = reservas;