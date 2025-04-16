import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local";
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import '../models/Usuario.js'
const Usuario = mongoose.model("usuarios")



export default function(passport) {

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {

        //Procurando o email q o usuário colocou
        Usuario.findOne({email: email}).then((usuario) => {
            //Se o email não existir  
            if(!usuario) {
                return done(null, false, {message: "Este usuário não existe!"})
            }

            //Se as senhas baterem
            bcrypt.compare(senha, usuario.senha, (erro, batem) => {

                if(batem){
                    return done(null, usuario)
                } else {
                    return done(null, false, {message: "Senha incorreta!"})
                }

            })
        })


    }))

    //Salva o usuario na sessão
    passport.serializeUser((user, done) => {

        done(null, user.id)

    })

    //Também ajuda a salvar
    passport.deserializeUser((id, done) => {
        Usuario.findById(id)
            .then(usuario => done(null, usuario))
            .catch(err => done(err));
    });
    





}