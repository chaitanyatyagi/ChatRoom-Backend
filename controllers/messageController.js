const Message = require("../model/messageModel")

exports.addMessage = async (req,res,next) => {
    try{
        const {from,to,message} = req.body
        const data = await Message.create({
            message:{text:message},
            users:[from,to],
            sender:from
        })
        return res.status(200).json({msg:"Message added successfully."})
    }
    catch(error){
        next(error)
    }
}

exports.getMessage = async (req,res,next) => {
    try{
        const {from,to} = req.body
        const messages = await Message.find({
            users:{
                $all:[from,to]
            },
        }).sort({updatedAt:1})
        const projectMessages = messages.map((msg)=>{
            return {
                fromSelf:msg.sender.toString === from,
                message:msg.message.text
            }
        })
        res.status(200).json(projectMessages)
    }
    catch(error){next(error)}
}