var questions = [];
var answers = [];
var results = [];
var maxID = 0;

function Question(){
  this.id = maxID + 1;
  maxID += 1;
  this.text = "";
  this.answers = [];
}

function Result(){
  this.id = maxID + 1;
  maxID += 1;
  this.text = "";
}

function Answer(){
  this.id = maxID + 1;
  maxID += 1;
  this.text = "";
  this.displayQuestion;
  this.linksTo = [];
}

function addQuestion(text){
  var question = new Question;
  question.text = text;
  questions.push(question);
  return question.id;
}

function addResult(text){
  var result = new Result;
  result.text = text;
  results.push(result);
  return result.id;
}

function addAnswer(text, displayQuestion, linksTo){
  var answer = new Answer;
  answer.text = text;
  answer.displayQuestion = displayQuestion;
  if(getQuestion(displayQuestion.id) != -1){
    questions[getQuestion(displayQuestion.id)].answers.push(answer.id);
  }
  answer.linksTo = linksTo;
  answers.push(answer);
  return answer.id;
}

function getQuestion(id){
  for(var i = 0; i < questions.length; i++){
    if(questions[i].id == id){
      return i;
    }
  }
  return -1;
}

function getResult(id){
  for(var i = 0; i < results.length; i++){
    if(results[i].id == id){
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

$(document).ready(function(){
  $('#addQuestion').click(function(){
    var text = $('#newQuestionText')[0].value;
    var questionID = addQuestion(text);
    $('#displayPage')[0].innerHTML += `<option value="${questionID}">${text}</option>`;
    $('#nextPage')[0].innerHTML += `<option value="${questionID}">${text}</option>`;
    $('#questions')[0].innerHTML += `<option value="${questionID}">${text}</option>`;
  });

  $('#addResult').click(function(){
    var text = $('#newResultText')[0].value;
    var resultID = addResult(text);
    $('#nextPage')[0].innerHTML += `<option value="${resultID}">${text}</option>`;
    $('#results')[0].innerHTML += `<option value="${resultID}">${text}</option>`;
  });

  $('#addAnswer').click(function(){
    var text = $('#newAnswerText')[0].value;
    var display = $('#displayPage')[0].value;
    var linksTo = $('#nextPage')[0].value;
    var answerID = addAnswer(text, display, linksTo);
    $('#answers')[0].innerHTML += `<option value="${answerID}">${text}</option>`;
  });
});
