import mongoose from 'mongoose'

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    eAdmin: {
        type: Number,
        default: 0
    },
        data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("usuarios", UsuarioSchema)
export default mongoose.model("usuarios", UsuarioSchema)