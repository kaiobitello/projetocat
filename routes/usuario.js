import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import Usuario from '../models/Usuario.js';

router.get("/", (req, res) => {
    res.send("OI")
})

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})


export default router;