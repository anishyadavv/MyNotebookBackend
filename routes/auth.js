const express = require('express');
const User =    require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fecthuser');

const JWT_SECRET = 'ALPHA';
router.post('/createUser', async (req,res)=>{
    let success = false;
    try{
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({success,error:"sorry user exists already!!!"})
        }

        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.password,salt);

        userData = await User.create({
            name: req.body.name,
            password: securePass,
            email: req.body.email,
        });
        const data ={
            user:{
                id:userData.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtoken});
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("some error occured");
    }
});

//Authenticate login

router.post('/login', async (req,res)=>{
    const {email, password} = req.body; 
    let success = false;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.json({success,error:"Please enter valid credintials"});
        }
        
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.json({success,error: "Please enter valid credintials"});
        }

        const data = {
            user: {
              id: user.id
            }
          }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtoken});
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("some error occured");
    }

})

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser,  async (req, res) => {

    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })

module.exports = router;