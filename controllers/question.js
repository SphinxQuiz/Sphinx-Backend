const Question = require("../models/Question");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.getOne = async (req, res, next) => {
  try {
    let nb_questions = await Question.count();
    let random = Math.floor(Math.random() * (nb_questions - 0 + 1));
    //await Question.find().limit(-1).skip(random).next()
    let reponse = await Question.find().skip(random).limit(1);
    const r = reponse[0];
    const { id, question, category, type, difficulty } = r;
    const reponseTab = [];
    reponseTab.push(r.correct_answer);
    reponseTab.push(...r.incorrect_answers);

    tabSend = [];
    let n = reponseTab.length;
    for (let i = 0; i < n; i++) {
      let index = Math.floor(Math.random() * reponseTab.length);
      tabSend.push(reponseTab[index]);
      reponseTab.splice(index, 1);
    }

    res.status(200).send({
      id,
      question,
      category,
      type,
      difficulty,
      tabSend,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};

exports.getFromId = async (req, res, next) => {
  try {
    const { difficulty, token, answer } = req.body;

    if (!token) {
      res.status(400).send({ error: "You must login" });
    }

    const decodedToken = jwt.verify(token, process.env.SPHINX_TOKEN_KEY);
    const userId = decodedToken.userId;


    let { id } = req.params;
    let reponse = await Question.find({ _id: id });

    let uInfo = await User.find({_id: userId}).select("-_id maxStreak currentStreak")
    maxS = uInfo[0].maxStreak
    currentS = uInfo[0].currentStreak

    console.log(currentS)
    console.log(maxS)


    const { correct_answer } = reponse[0];
    var myquery = { _id: userId };
    let adding = -10;

    if(correct_answer === answer){
      currentS += 1
        if(difficulty === "hard"){
            adding = 30
        }
        else if (difficulty == "medium"){
            adding = 20
        }
        else if(difficulty == "easy"){
            adding = 10
        }

        if(currentS >= maxS){
          console.log("test")
          var newvalues = { $inc: { score: adding, goodAnswer: 1, currentStreak: 1}, $set:{maxStreak: currentS}};
        }
        else{
          var newvalues = { $inc: { score: adding, goodAnswer: 1, currentStreak: 1}};

        }
    }
    else{
        var newvalues = { $inc: { score: adding, badAnswer: 1 }, $set: {currentStreak: 0}};
    }


    try {
      let u = await User.findByIdAndUpdate(
        myquery,
        newvalues,
        { upsert: true }
      );
      return res.status(201).send({ correct_answer });
    } catch (error) {
      return res.status(500).send({ error: error });
    }
        
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};
