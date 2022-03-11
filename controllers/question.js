const Question = require("../models/Question");



exports.getOne =  async (req, res, next) => {
    try {
        let nb_questions = await Question.count();
        let random = Math.floor(Math.random() * ( nb_questions - 0 + 1))
        //await Question.find().limit(-1).skip(random).next()
        let reponse = await Question.find().skip(random).limit(1)
        const id = reponse[0]._id
        const question = reponse[0].question
        const reponseTab = []
        reponseTab.push(reponse[0].correct_answer)
        reponseTab.push( ... reponse[0].incorrect_answers)

        tabSend = []
        let n = reponseTab.length
        for(let i = 0; i < n; i ++){
            let index = Math.floor(Math.random() * reponseTab.length);
            tabSend.push(reponseTab[index])
            reponseTab.splice(index, 1)
            
        }
        
        res.status(200).send({
            id,
            question,
            tabSend
        })




    } catch (error) {
        console.log(error)
        res.status(500).send({error});
    }
}

exports.getFromId =  async (req, res, next) => {
    try {
        let {id} = req.params;
        let reponse = await Question.find({id})

        console.log(reponse)
    } catch (error) {
        console.log(error)
        res.status(500).send({error});
    }
}
