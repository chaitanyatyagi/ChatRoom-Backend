const User = require("../model/userModel")
const bcrypt = require("bcrypt")
const axios = require("axios")
const Buffer = require("buffer").Buffer

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const usernameCheck = await User.findOne({ username })
        if (usernameCheck) {
            return res.status(200).json({
                msg: "Username already used",
                status: false
            })
        }
        const emailCheck = await User.findOne({ email })
        if (emailCheck) {
            return res.status(200).json({
                msg: "Email already used",
                status: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            email, username, password: hashedPassword
        })
        delete user.password
        return res.status(200).json({
            status: true,
            user
        })
    }
    catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(200).json({
                msg: "Incorrect Username",
                status: false
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(200).json({
                msg: "Incorrect Password",
                status: false
            })
        }
        delete user.password
        return res.status(200).json({
            status: true,
            user
        })
    }
    catch (error) {
        next(error)
    }
}

exports.logOut = (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      onlineUsers.delete(req.params.id);
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };

exports.setAvatarImage = async (req, res, next) => {
    try {
        const data = []
        const arr = ["John", "Jane", "Margus", "Janny"]
        // const api = `https://api.multiavatar.com/4645646`
        const api = "https://api.dicebear.com/6.x/lorelei/svg"
        for (let i = 0; i < 4; i++) {
            const image = await axios.get(
                `${api}/seed=${arr[i]}`
            );
            const buffer = Buffer.from(image.data).toString('base64')
            // const buffer = new Buffer(image.data);
            data.push(buffer);
        }
        return res.json(data)
    }
    catch (error) { next(error) }
}

exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarImage,
            },
            { new: true }
        );
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (ex) {
        next(ex);
    }
}

exports.getAllUsers = async (req, res, next) => { 
    try{
        const users = await User.find({_id:{$ne:req.params.id}}).select([
            "email","username","avtarImage","_id"
        ])
        return res.status(200).json(users)
    }
    catch(error){next(error)}
}