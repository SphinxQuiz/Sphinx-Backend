const Question = require("../models/Question");



exports.getOne =  async (req, res, next) => {
    try {
        let nb_questions = await Question.count();
        let random = Math.floor(Math.random() * ( nb_questions - 0 + 1))
        //await Question.find().limit(-1).skip(random).next()
        let reponse = await Question.find().skip(random).limit(1)
        const r = reponse[0]
        const { id, question, category, type, difficulty} = r
        const reponseTab = []
        reponseTab.push(r.correct_answer)
        reponseTab.push( ... r.incorrect_answers)

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
            category,
            type,
            difficulty,
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
        let reponse = await Question.find({_id: id})

        const { correct_answer} = reponse[0]

        res.status(201).send({
            correct_answer
        })
        

        
    } catch (error) {
        console.log(error)
        res.status(500).send({error});
    }
}
