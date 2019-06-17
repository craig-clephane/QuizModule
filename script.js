var questions = [];
var answers = [];
var maxID = 0;

function Question(){
  this.id = maxID + 1;
  maxID += 1;
  this.text = "";
  this.answers = [];
}

function Answer(){
  this.id = maxID + 1;
  maxID += 1;
  this.text = "";
  this.question;
  this.nextQuestions = [];
}

function addQuestion(text){
  var question = new Question;
  question.text = text;
  question.id = questions.length;
  questions.push(question);
}

function addAnswer(question, text, nextQuestions){
  var answer = new Answer;
  answer.text = text;
  answer.question = question.id;
  for(var i = 0; i < nextQuestions.length; i++){
    answer.nextQuestions.push(nextQuestions[i].id);
  }
  questions[getQuestion(question.id)].answers.push(answer.id);
  answers.push(answer);
}

function getQuestion(id){
  for(var i = 0; i < questions.length; i++){
    if(questions[i].id == id){
      return i;
    }
  }
  return -1;
}

function getAnswer(id){
  for(var i = 0; i < answers.length; i++){
    if(answers[i].id == id){
      return i;
    }
  }
  return -1;
}
