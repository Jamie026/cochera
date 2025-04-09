const express = require("express");
const contratos = express.Router();
const connection = require("../config/db");

contratos.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM contrato");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener contratos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

contratos.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await connection.query("SELECT * FROM contrato WHERE id = ?", [id]);
        if (results.length === 0) 
            return res.status(404).json({ message: "Contrato no encontrado" });
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error al obtener contrato:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

contratos.post("/", async (req, res) => {
    const { id_reserva, fecha_firma, firmado, monto } = req.body;
    try {
        const [verificaciones] = await connection.query("SELECT * FROM verificacion WHERE id_reserva = ? AND estado = 'Aprobada'", [id_reserva]);
        if (verificaciones.length === 0)
            return res.status(404).json({ message: "Reserva verificada no encontrada" });
        await connection.query(
            "INSERT INTO contrato (id_reserva, fecha_firma, firmado, monto) VALUES (?, ?, ?, ?)",
            [id_reserva, fecha_firma, firmado || false, monto]
        );
        res.status(201).json({ message: "Contrato creado correctamente" });
    } catch (error) {
        console.error("Error al crear contrato:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

contratos.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { fecha_firma, firmado, monto } = req.body;
    try {
        await connection.query(
            "UPDATE contrato SET fecha_firma = ?, firmado = ?, monto = ? WHERE id = ?",
            [fecha_firma, firmado, monto, id]
        );
        res.status(200).json({ message: "Contrato actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar contrato:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

contratos.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query("DELETE FROM contrato WHERE id = ?", [id]);
        res.status(200).json({ message: "Contrato eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar contrato:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = contratos;