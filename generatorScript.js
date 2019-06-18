var questions = [];
var answers = [];
var results = [];
var maxID = 0;

function Question(){
  this.id = maxID;
  maxID += 1;
  this.text = "";
  this.description = "";
  this.answers = [];
}

function Result(){
  this.id = maxID;
  maxID += 1;
  this.text = "";
  this.description = "";
}

function Answer(){
  this.id = maxID;
  maxID += 1;
  this.text = "";
  this.displayQuestion;
  this.linksTo = [];
}

function addQuestion(text, description){
  var question = new Question;
  question.text = text;
  question.description = description;
  questions.push(question);
  return question.id;
}

function addResult(text, description){
  var result = new Result;
  result.text = text;
  result.description = description;
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
    var text = $('#newQuestionText')[0].value.trim();
    var description = $('#newQuestionDesc')[0].value.trim();
    if(text != ""){
      $('#questionTextVal').addClass("hidden");
      $('#questionSuccess').removeClass("hidden");
      setTimeout(function(){
        $('#questionSuccess').animate({opacity:'0'}, 1000, function(){
          $('#questionSuccess').addClass("hidden");
          $('#questionSuccess')[0].style.opacity = 1;
        });
      }, 2000);
      var questionID = addQuestion(text, description);
      updateSelections();
      $('#newQuestionText')[0].value = "";
    }
    else{
      $('#questionTextVal').removeClass("hidden");
    }
  });

  $('#addResult').click(function(){
    var text = $('#newResultText')[0].value.trim();
    var description = $('#newResultDesc')[0].value.trim();
    if(text != ""){
      $('#resultTextVal').addClass("hidden");
      $('#resultSuccess').removeClass("hidden");
      setTimeout(function(){
        $('#resultSuccess').animate({opacity:'0'}, 1000, function(){
          $('#resultSuccess').addClass("hidden");
          $('#resultSuccess')[0].style.opacity = 1;
        });
      }, 2000);
      var resultID = addResult(text, description);
      updateSelections();
      $('#newResultText')[0].value = "";
    }
    else{
      $('#resultTextVal').removeClass("hidden");
    }
  });

  $('#addAnswer').click(function(){
    var text = $('#newAnswerText')[0].value.trim();
    var display = $('#displayPage')[0].value.trim();
    var linksTo = $('#nextPage')[0].value.trim();
    var validated = true;
    if(text == ""){
      $('#answerTextVal').removeClass("hidden");
      validated = false;
    }
    if(display == ""){
      $('#answerToVal').removeClass("hidden");
      validated = false;
    }
    if(linksTo == ""){
      $('#leadsToVal').removeClass("hidden");
      validated = false;
    }
    if(validated){
      $('#answerTextVal').addClass("hidden");
      $('#answerToVal').addClass("hidden");
      $('#leadsToVal').addClass("hidden");
      $('#answerSuccess').removeClass("hidden");
      setTimeout(function(){
        $('#answerSuccess').animate({opacity:'0'}, 1000, function(){
          $('#answerSuccess').addClass("hidden");
          $('#answerSuccess')[0].style.opacity = 1;
        });
      }, 2000);
      $('#newAnswerText')[0].value = "";
      var answerID = addAnswer(text, display, linksTo);
      updateSelections();
    }
  });

  $('#downloadButton').click(function(){
    var invalidQuestions = [];
    var validated = true;
    var errorMessage;
    for(var i = 0; i < questions.length; i++){
      if(questions[i].answers.length == 0){
        validated = false;
        invalidQuestions.push(questions[i].text);
      }
    }

    if(!validated){
      errorMessage = `The following question have no linked answers! Did you mean to make these results?<br><br> ${invalidQuestions.join(", ")}`;
    }

    if(results.length == 0){
      errorMessage = "You haven't added any results!";
      validated = false;
    }

    if(questions.length == 0){
      errorMessage = "You haven't added any questions!";
      validated = false;
    }

    if(validated){
      $('#exportVal').addClass("hidden");
      exportToJson();
    }
    else{
      $('#exportVal')[0].innerHTML = errorMessage;
      $('#exportVal').removeClass("hidden");
    }
  });
});
