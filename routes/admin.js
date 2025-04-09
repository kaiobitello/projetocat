import express from 'express'
const router = express.Router()
import mongoose from 'mongoose'
import '../models/Categoria.js'
const Categoria = mongoose.model("categorias")

router.get('/',(req,res) => {
    res.render('admin/index.handlebars')
})

router.get('/posts', (req,res) => {
    res.send('Página de posts')
})

router.get('/categorias', (req, res)=> {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render('admin/categorias.handlebars', {categorias:categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar as Categorias, tente novamente.")
    })
})

router.get('/categorias/add', (req,res)=> {
    res.render('admin/addcat.handlebars')
})

router.post("/categorias/nova",(req, res) => {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.trim().length < 3) {
        erros.push({texto: "Nome Inválido!"})
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null || req.body.slug.trim().length < 3){
        erros.push({texto: "Slug Inválido!"})
    }

    if (erros.length > 0) {
        res.render("admin/addcat.handlebars", {erros: erros})
    } else {

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso")
            res.redirect('/admin/categorias')
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao tentar criar esta categoria, tente novamente!")
            res.redirect("/admin/categorias")
        })
    }})

    router.post("/categorias/delete", (req,res) => {
        Categoria.deleteOne({_id: req.body.id}).then(() => {
            req.flash("success_msg", "Categoria deletada com sucesso!")
            res.redirect('/admin/categorias')
        }).catch((err) => {
            console.log("Ocorreu um erro ao deletar a categoria. "+err)
            req.flash("error_msg", "Houve um erro ao deletar a categoria.")
            res.redirect("/admin/categorias")
        })
    })

    router.post('/categorias/edit', (req,res)=>{

        var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.trim().length > 3) {
        erros.push({texto: "Nome Inválido!"})
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null || req.body.slug.trim().length > 3){
        erros.push({texto: "Slug Inválido!"})
    }

    if (erros.length > 0) {
        res.render("admin/editcat.handlebars", {erros: erros})
    } else {
        Categoria.findOne({_id: req.body.id}).then((categoria)=>{

            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                console.log("Ocorreu um erro ao salvar a categoria: ", err)
                req.flash("error_msg", "Ocorreu um erro ao editar a categoria, tente novamente.")
                res.redirect("/admin/categorias");
            })

        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a edição da categoria.")
            res.redirect("/admin/categorias")
        })
    }})

    router.get('/categorias/edit/:id', (req, res) => {
        Categoria.findOne({_id: req.params.id}).lean().then((categorias) => {
            res.render('admin/editcat.handlebars', { categoria: categorias });
        }).catch((err) => {
            req.flash("error_msg", "Esta categoria não existe!")
            res.redirect("/admin/categorias")
        })

    })
    
export default router