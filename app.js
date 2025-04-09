import express from 'express'
import { engine } from 'express-handlebars'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import admin from './routes/admin.js'
import path from 'path'
import session from 'express-session';
import flash from 'connect-flash'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()

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

app.use('/admin', admin)

//Resto;
const PORT = 2903
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: http://localhost:${PORT}`)
})