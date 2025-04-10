import express from 'express'
const router = express.Router()
import mongoose from 'mongoose'
import '../models/Categoria.js'
import '../models/Postagem.js'
const Categoria = mongoose.model("categorias")
const Postagem = mongoose.model("postagens")


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

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.trim().length < 3) {
        erros.push({texto: "Nome Inválido!"})
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null || req.body.slug.trim().length < 3){
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
    
    router.get("/postagens", (req, res) => {
        Postagem.find().populate("categoria").then((postagens) => {
            res.render('admin/postagens', {postagens})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao carregar as postagens, tente novamente.")
        })
    })

    router.get("/postagens/add", (req, res) => {
    
        Categoria.find().then((categorias) => {
            res.render("admin/addpostagem", {categorias: categorias})
        }).catch((err) => {
            console.log("Ocorreu um erro! "+err)
            req.flash("error_msg", "Ocorreu um erro ao abrir a página, tente novamente.")
            res.redirect("/postagens")
        })
    })


    router.post("/postagens/nova", (req, res) => {

        var erros = []

        if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null || req.body.titulo.trim().length < 3) {
            erros.push({texto: "Nome Inválido!"})
        }
    
        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null || req.body.slug.trim().length < 3){
            erros.push({texto: "Slug Inválido!"})
        }
    
        if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null || req.body.descricao.trim().length < 10){
            erros.push({texto: "Descrição Inválida!"})
        }
    
        if (!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null || req.body.conteudo.trim().length > 20){
            erros.push({texto: "Conteúdo Inválido!"})
        }

        if(req.body.categoria == "0") {
            erros.push({texto: "Categoria Inválida, registre uma no menu."})
        }

        if (erros.length > 0) {
            res.render("admin/addpostagem", {erros: erros})
        } else {
            const novaPostagem = {
                titulo: req.body.titulo,
                slug: req.body.slug,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria,
            }

            new Postagem(novaPostagem).save().then(() => {
                req.flash("success_msg", "A Postagem foi criada com sucesso!")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                console.log("Ocorreu um erro ao tentar criar uma postagem: "+err)
                req.flash("error_msg", "Ocorreu um erro ao tentar criar a postagem.")
                res.redirect("/admin/postagens")
            })

        }

        

    })

export default router