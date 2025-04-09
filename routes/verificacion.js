const express = require("express");
const verificaciones = express.Router();
const connection = require("../config/db");

verificaciones.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM verificacion");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener verificaciones:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

verificaciones.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await connection.query("SELECT * FROM verificacion WHERE id = ?", [id]);
        if (results.length === 0) 
            return res.status(404).json({ message: "Verificación no encontrada" });
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error al obtener verificación:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

verificaciones.post("/", async (req, res) => {
    const { id_reserva, estado, observaciones } = req.body;
    try {
        const [reservas] = await connection.query("SELECT * FROM reserva WHERE id = ?", [id_reserva]);
        if (reservas.length === 0)
            return res.status(404).json({ message: "Reserva no encontrada" });
        await connection.query(
            "INSERT INTO verificacion (id_reserva, estado, observaciones) VALUES (?, ?, ?)",
            [id_reserva, estado || "Pendiente", observaciones || null]
        );
        res.status(201).json({ message: "Verificación creada correctamente" });
    } catch (error) {
        console.error("Error al crear verificación:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

verificaciones.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { estado, observaciones } = req.body;
    try {
        await connection.query(
            "UPDATE verificacion SET estado = ?, observaciones = ? WHERE id = ?",
            [estado, observaciones, id]
        );
        res.status(200).json({ message: "Verificación actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar verificación:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

verificaciones.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query("DELETE FROM verificacion WHERE id = ?", [id]);
        res.status(200).json({ message: "Verificación eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar verificación:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = verificaciones;
