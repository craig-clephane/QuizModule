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
  if(getQuestion(displayQuestion) != -1){
    questions[getQuestion(displayQuestion)].answers.push(answer.id);
  }
  answer.linksTo = linksTo;
  answers.push(answer);
  return answer.id;
}

function removeQuestion(questionID){
  var linkedAnswers = questions[getQuestion(questionID)].answers;
  for(var i = 0; i < linkedAnswers.length; i++){
    removeAnswer(linkedAnswers[i]);
  }

}

function removeAnswer(answerID){
  for(var i = questions[getQuestion(answers[getAnswer(answerID)].displayQuestion)].answers.length-1; i <= 0; i--){
    if(questions[getQuestion(answers[getAnswer(answerID)].displayQuestion)].answers[i] == answerID){
      questions[getQuestion(answers[getAnswer(answerID)].displayQuestion)].answers.splice(i, 1);
    }
  }
  answers.splice(answers.indexOf(answerID), 1);
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

function updateSelections(){
  $('#displayPage')[0].innerHTML = "";
  $('#nextPage')[0].innerHTML = "";
  $('#questions')[0].innerHTML = "";
  $('#results')[0].innerHTML = "";
  $('#answers')[0].innerHTML = "";
  for(var i = 0; i < questions.length; i++){
    $('#displayPage')[0].innerHTML += `<option value="${questions[i].id}">${questions[i].text}</option>`;
    $('#nextPage')[0].innerHTML += `<option value="${questions[i].id}">${questions[i].text}</option>`;
    $('#questions')[0].innerHTML += `<option value="${questions[i].id}">${questions[i].text}</option>`;
  }
  for(var i = 0; i < results.length; i++){
    $('#nextPage')[0].innerHTML += `<option value="${results[i].id}">${results[i].text}</option>`;
    $('#results')[0].innerHTML += `<option value="${results[i].id}">${results[i].text}</option>`;
  }
  for(var i = 0; i < answers.length; i++){
    $('#answers')[0].innerHTML += `<option value="${answers[i].id}">${answers[i].text}</option>`;
  }
}

function exportToJson(){
  var toOutput = [questions, results, answers];
  var jsonOutput = JSON.stringify(toOutput);
  var data = "text/json;charset=utf-8," + encodeURIComponent(jsonOutput);
  $('#downloadButton').prop("href", `data:${data}`);
  $('#downloadButton').innerHTML = "Regenerate JSON";
}

$(document).ready(function(){
  $('#addQuestion').click(function(){
    var text = $('#newQuestionText')[0].value;
    var questionID = addQuestion(text);
    updateSelections();
  });

  $('#addResult').click(function(){
    var text = $('#newResultText')[0].value;
    var resultID = addResult(text);
    updateSelections();
  });

  $('#addAnswer').click(function(){
    var text = $('#newAnswerText')[0].value;
    var display = $('#displayPage')[0].value;
    var linksTo = $('#nextPage')[0].value;
    var answerID = addAnswer(text, display, linksTo);
    updateSelections();
  });

  $('#downloadButton').click(exportToJson);
});
