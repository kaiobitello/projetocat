import mongoose from "mongoose";
const Schema = mongoose.Schema

const Postagem = new Schema({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },

    imagem: {
        type: String
    },

    data: {
        type: Date,
        default: Date.now
    }
    
})

mongoose.model("postagens", Postagem)