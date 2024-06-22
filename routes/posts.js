const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const { json } = require("express");

//CREATE POST

router.post('/', async (req,res)=>{
    try {
      const newPost = new Post(req.body);
      const post = await newPost.save();
      res.json(post);
      } catch (error) {
        console.error(error.response);
      }
})

//UPDATE POST

router.put('/:id', async (req,res)=>{
    const post = await Post.findById(req.params.id);
    if(post.username === req.body.username){
        try {
            const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
            $set:req.body
            },{new:true})
            res.status(200).json(updatedPost)
        } catch (error) {
            res.status(400).json(error)
        }
    }
    else{
        res.status(401).json("You can Update only your posts")
    }
})

//DELETE POST

router.delete('/:id',async (req, res)=>{
    const post = await Post.findById(req.params.id);
    if(post.username === req.body.username){
        // console.log(post.username);
        try {
       await post.deleteOne();
        res.status(200).json("Post deleted ");
    } catch (error) {
        res.status(500).json(error);
    }
    }
    else{
        res.status(404).json("You can delete your post only")
    }
})

//GET POST

router.get("/:id", async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})


//GET ALL POST

router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
    // console.log("All not ok");
  } catch (err) {
    res.status(500).json(err);
  }
});


//Comment

router.put('/comment/:id', async (req,res)=>{
    const { comment } = req.body;
    try {
        const postComment = await Post.findByIdAndUpdate(req.params.id, {
            $push: { comments: { text: comment } }
        },
            { new: true }
        );
        const post = await Post.findById(postComment._id).populate('comments.postedBy', 'name email');
        res.status(200).json({
            success: true,
            post
        })

    } catch (error) {
        next(error);
    }
})

// Like

// router.put('/like/:id', (req, res)=>{
//   Post.findByIdAndUpdate(req.body,{
//     $push:{likes:req.post._id}
//   }, {new:true})
// })

//Unlike

// router.post('/unlike/:id', (req, res)=>{
//   Post.findByIdAndUpdate(req.body.postId,{
//     $pull:{likes:req.user._id}
//   }, {new:true})
// })


module.exports = router;