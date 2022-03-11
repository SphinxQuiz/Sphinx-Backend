const Question = require("../models/Question");



exports.getOne =  async (req, res, next) => {
    try {
        let nb_questions = await Question.count();
        let random = Math.floor(Math.random() * ( nb_questions - 0 + 1))
        //await Question.find().limit(-1).skip(random).next()
        let reponse = await Question.find().skip(random).limit(1)
        console.log(reponse)
    } catch (error) {
        console.log(error)
        res.status(500).send({error});
    }
}

exports.getFromId =  async (req, res, next) => {
    try {
        let {id} = req.body;
        let reponse = await Question.find({id})
        
        console.log(reponse)
    } catch (error) {
        console.log(error)
        res.status(500).send({error});
    }
}
