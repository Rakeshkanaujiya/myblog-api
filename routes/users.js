const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post")
const bcrypt = require("bcrypt");

//UPDATE
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set: req.body,
      },{ new: true });
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can update only your account!");
  }
});

//DELETE

router.delete('/:id', async (req, res)=>{
  if(req.body.userId === req.params.id){
    try {
      const user = await User.findById(req.params.id)
      try {
        await Post.deleteMany({username:user.username});
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account Deleted Successful");
      } catch (error) {
        res.status(500).json(error)
      }
    } catch (error) {
      res.status(404).json("User not found!")
    }
  }
  else{
    res.status(401).json("You Can Delete Only Your Account")
  }
});


//GET USER

router.get('/:id', async(req, res)=>{
  if(req.body.userId === req.params.id){
    try {
        const user = await User.findById(req.params.id);
        const {password, ...other} = user._doc;
        res.status(200).json(other);
        } catch (error) {
        res.status(400).json(error)
        }
      }
      else{
        res.status(401).json("Account not found");
      }
    
})

module.exports = router;

// {
//     "username":"safak",
//     "email":"safak@gmail.com",
//     "password":"123456"
// }