import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import passport from 'passport';

router.get("/", (req, res) => {
    res.send("OI")
    })

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {

var erros = []

if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.length < 2) {
    erros.push({texto: "Nome inválido!"})
}
if(!req.body.email || typeof req.body.email == undefined || req.body.email == null || req.body.email.length < 5) {
    erros.push({texto: "Email inválido!"})
}

if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
    erros.push({texto: "Senha inválida!"})
}

if(req.body.senha.length < 4) {
    erros.push({texto: "Senha muito curta!"})

}

if(req.body.senha != req.body.senha2) {
    erros.push({texto: "As senhas são diferentes!"})
} 

if(erros.length > 0) {
    res.render("usuarios/registro", {erros: erros})
} else {

    Usuario.findOne({email: req.body.email}).then((usuario) => {
        if(usuario) {
            req.flash("error_msg", "Já existe uma conta com esse email.")
            res.redirect("/usuarios/registro")
        } else {
            const novoUsuario = new Usuario({
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha,
            })

            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                    if(erro){
                        req.flash("error_msg", "Houve um erro durante o salvamento do usuário.")
                        res.redirect("/")
                    }

                    novoUsuario.senha = hash
                    novoUsuario.save().then(() => {
                        req.flash("success_msg", "Usuário salvo com sucesso!")
                        res.redirect("/")
                    }
                    ).catch((err) => {
                        req.flash("error_msg", "Ocorreu um erro ao salvar o usuário.")
                        res.redirect("/usuarios/registro")
                    })
            })
        })
        }
    }).catch((err) => {
        console.log("Ocorreu um erro: " + err)
        req.flash("error_msg", "Houve um erro interno.")
        res.redirect("/")
    })
}
})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {

    passport.authenticate("local", {
        //Se der certo, redireciona pra essa rota
        successRedirect: "/",
        //Se der errado, redireciona pra essa rota
        failureRedirect: "/usuarios/login",
        //Habilitada mensagens flash
        failureFlash: true
    })(req, res, next)

})

router.get("/logout", (req, res) => {

    req.logout((err) => {
        if (err) {
          return next(err) // ou trata o erro do jeito que quiser
        }
    })
    req.flash("success_msg", "Desconectado da conta com sucesso!")
    res.redirect("/")


})


export default router;