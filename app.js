import express from 'express'
import { engine } from 'express-handlebars'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import admin from './routes/admin.js'
import './models/Postagem.js'
import path from 'path'
import session from 'express-session';
import flash from 'connect-flash'
import multer from 'multer'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()
const Postagens = mongoose.model("postagens")

//Config;

//Sessão

app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//Middleware

app.use((req,res,next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})


//Body-Parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Desabilita a verificação
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


//Mongoose

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/blogapp").then(function(){
    console.log("Conectado com sucesso!")
}).catch(function(erro){
    console.log(`Erro! ${erro}`)
})

//public

app.use(express.static(path.join(__dirname, 'public')))

//Rotas;

app.get("/", (req, res) => {
    Postagens.find().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render("index", {postagens: postagens})
    }).catch((err) => {
        console.log("Ocorreu um erro ao listar as postagens no menu." +err)
        req.flash("error_msg", "Ocorreu um erro ao listar as postagens.")
        res.redirect("/404")
    })

})

app.get("/postagens/:slug", (req, res) => {
    Postagens.findOne({slug: req.params.slug}).then((postagem) => {
        if(postagem) {
            res.render("postagem/index", {postagem: postagem})
        } else {
            req.flash("error_msg", "Ocorreu um erro ao carregar a postagem.")
            res.redirect("/")
        }
    }).catch((err) => {
        console.log("Ocorreu um erro ao carregar a postagem: ")
        req.flash("error_msg", "Houve um erro interno.")
        res.redirect("/")
    })
})

app.get("/404", (req, res) => {
    res.send("ERRO 404!")
})

app.use('/admin', admin)

//Resto;
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT))