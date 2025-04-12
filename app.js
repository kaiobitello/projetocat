import express from 'express'
import { engine } from 'express-handlebars'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import admin from './routes/admin.js'
import usuarios from './routes/usuario.js'
import './models/Postagem.js'
import path from 'path'
import session from 'express-session';
import flash from 'connect-flash'
import multer from 'multer'
import './models/Categoria.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()
const Postagens = mongoose.model("postagens")
const Categoria = mongoose.model("categorias")
import mongoStore from 'connect-mongo'
import 'dotenv/config';


//Config;

//Sessão

app.use(session({
    secret: 'eudouocupramendigo', // Substitua por um segredo seguro
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
        mongoUrl: process.env.MONGO_URI, // URL do MongoDB
        ttl: 14 * 24 * 60 * 60 // Tempo de vida da sessão (14 dias)
    })
}));
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

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado ao MongoDB Atlas');
}).catch((err) => {
    console.log('Erro ao conectar ao MongoDB:', err);
});

//public

app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

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

app.get("/categorias", (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("categorias/index", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Ocorreu um erro ao carregar as categorias.")
        res.redirect("/")
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

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).then((categoria) => {

        if(categoria) {
            Postagens.find({categoria: categoria._id}).then((postagens) => {
                res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao listar as postagens.")
                res.redirect("/")
            })
        } else {
            req.flash("error_msg", "Essa categoria não existe.")
            res.redirect("/")
        }

    }).catch((err) => {
        req.flash("error_msg", "Essa categoria não existe.")
        res.redirect("/")
    })
})
app.get("/404", (req, res) => {
    res.send("ERRO 404!")
})

app.use('/admin', admin)
app.use("/usuarios", usuarios)

//Resto;
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT))