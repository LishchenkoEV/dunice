const  exspress= require('express')
const {Router}= require('express')
const router= Router()
const Post= require('../models/Post')
const {body, query} = require("express-validator");
router.post(
    '/new',
// параметры проверки
    async (req,res)=>{
        try{
//проверка данных
            const {title, tags, content, author}=req.body
                const post = new Post({
                    title,
                    tags,
                    content,
                    author})
                await post.save()
            res.status(200).json({massage:"Пост добавлен!"})
            }
        catch(e){
            res.status(500).json({massage:"Что-то пошло не так!"})
        }
    })


router.get(
    '/all',
// параметры проверки
    async (req,res)=>{
        try{
//проверка данны
            const {selectedTags}=req.query
            let postQuantity=0
            const authorQuantity= new Set()
            const tag= new Set()
            const now_year = new Date().getFullYear()
            const now_month = new Date().getMonth()
            const data= await Post.find({})
            let filter=data
            // подсчет количества постов и их авторов за последнийц месяц
            for (let item of data) {
                let tags = item.tags.split(',')
                for (let elem of tags)
                    if(elem!=="")
                        tag.add(elem)
                let year = new Date(item.date).getFullYear()
                let month = new Date(item.date).getMonth()
                if (year === now_year && month === now_month) {
                    postQuantity++
                    authorQuantity.add(item.author)
                }
            }
            if(selectedTags)
                for(let post of filter)
                {
                    let flag=false
                    for(let filter of selectedTags)
                        for(let tag of post.tags.split(','))
                            if(filter===tag) {
                                flag = true
                            }
                    if(!flag){
                        filter=filter.filter(item=>item.tags!==post.tags)
                    }
                }else filter=data

            //поиск
            res.json({data,tags:[...tag],postQuantity,authors:[...authorQuantity],tag:{selectedTags},filter})
        }
        catch(e){
            res.status(500).json({massage:"Что-то пошло не так!"})
        }
    })
router.get(
    '/post',
// параметры проверки
    async (req,res)=>{
        try{
//проверка данны
            const {postId}=req.query
            const data= await Post.find({_id:postId})
            if(data)
                res.json(data)
        }
        catch(e){
            res.status(500).json({massage:"Что-то пошло не так!"})
        }
    })


module.exports = router ;
