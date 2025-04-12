import mongoose from 'mongoose'

const UsuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String
})

mongoose.model("usuarios", UsuarioSchema)
export default mongoose.model("usuarios", UsuarioSchema)