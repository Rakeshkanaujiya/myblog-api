const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass
    });
  
    const user = await newUser.save();
    return res.json("success");
  } catch (err) {
    return res.json(err);
  }
});

//LOGIN

router.post('/login', async (req,res)=>{
  try {
    const {email, password} = req.body;
    await User.findOne({email:email}).then(user=>{
      if(user){
        bcrypt.compare(password, user.password, (err, data)=>{
          if(err) throw err;
          if(data){
            const {password, ...others} = user._doc;
            return res.status(200).json(others)
          }else{
            return res.json("Incorect Password")
          }
        })
      }
      else{
        return res.json("User not exist")
      }
    })
  } catch (error) {
    return res.status(500).json(error)
  }
})


// Forget Password

router.post('/forgetpassword', async (req,res)=>{
  try {
    const {email} = req.body;
    await User.findOne({email:email}).then(user=>{
      if(user){
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'r3297084@gmail.com',
              pass: 'vwdi ikjo njgn gwuh'
            }
          });
          
          var mailOptions = {
            from: 'r3297084@gmail.com',
            to: email,
            subject: 'Reset Password Link',
            text: `http://localhost:5173/resetpassword/${user._id}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              return res.send({status: "success"})
            }
          });
        return res.status(200).json(user)
      }
      else{
        return res.json("User not exist")
      }
    })
  } catch (error) {
    return res.status(500).json(error)
  }
})

// Reset Password

router.post('/resetpassword/:id', (req, res) => {
    const {id, password} = req.body

            bcrypt.hash(password, 10)
            .then(hash => {
                User.findByIdAndUpdate({_id: id}, {password: hash})
                .then(u => res.send({status: "success"}))
                .catch(err => res.send({status: err}))
            })
            .catch(err => res.send({Status: err}))
        })
  


module.exports = router;

// {
//     "username":"safak",
//     "email":"safak@gmail.com",
//     "password":"123456"
// }



