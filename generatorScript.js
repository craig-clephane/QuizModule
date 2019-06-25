var questions = [];
var answers = [];
var results = [];
var feedbacks = [];
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
  this.linksTo;
  this.col = "";
  this.feedback;
}

function Feedback(){
  this.id = maxID;
  maxID += 1;
  this.text = "";
  this.linksTo;
  this.answer;
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

function addAnswer(text, displayQuestion, linksTo, col, feedbackText){
  var answer = new Answer;
  var feedback;
  answer.text = text;
  answer.displayQuestion = displayQuestion;
  if(getQuestion(displayQuestion) != -1){
    questions[getQuestion(displayQuestion)].answers.push(answer.id);
  }
  answer.col = col;
  console.log(feedbackText);
  if(feedbackText != ""){
    feedback = new Feedback;
    feedback.text = feedbackText;
    feedback.answer = answer.id;
    feedback.linksTo = linksTo;
    answer.linksTo = feedback.id;
    feedbacks.push(feedback);
  }
  else{
    answer.linksTo = linksTo;
  }
  answers.push(answer);
  return answer.id;
}

function removeQuestion(questionID){
  var linkedAnswers = questions[getQuestion(questionID)].answers;
  for(var i = 0; i < linkedAnswers.length; i++){
    removeAnswer(linkedAnswers[i]);
  }
  questions.splice(getQuestion(questionID), 1);
}

function removeResult(resultID){
  for(var i = 0; i < answers.length; i++){
    if(answers[i].linksTo == resultID){
      removeAnswer(answers[i].id);
    }
  }
  results.splice(getResult(resultID), 1);
}

function removeAnswer(answerID){
  var question = getQuestion(answers[getAnswer(answerID)].displayQuestion);
  for(var i = questions[question].answers.length-1; i >= 0; i--){
    if(questions[question].answers[i] == answerID){
      questions[question].answers.splice(i, 1);
    }
  }
  answers.splice(getAnswer(answerID), 1);
}

function getQuestion(id){
  for(var i = 0; i < questions.length; i++){
    if(questions[i].id == id){
      return i;
    }
  }
  return -1;
}

function getFeedback(id){
  for(var i = 0; i < feedbacks.length; i++){
    if(feedbacks[i].id == id){
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
  $('#list')[0].innerHTML = "";
  for(var i = 0; i < questions.length; i++){
    $('#displayPage')[0].innerHTML += `<option value="${questions[i].id}">${questions[i].text}</option>`;
    $('#nextPage')[0].innerHTML += `<option value="${questions[i].id}">${questions[i].text}</option>`;
    $('#questions')[0].innerHTML += `<option value="${questions[i].id}">${questions[i].text}</option>`;
    $('#list')[0].innerHTML += `<div id="question${questions[i].id}" class="question"><h4>Question: ${questions[i].text}</h4></div>`;
  }
  for(var i = 0; i < results.length; i++){
    $('#nextPage')[0].innerHTML += `<option value="${results[i].id}">${results[i].text}</option>`;
    $('#results')[0].innerHTML += `<option value="${results[i].id}">${results[i].text}</option>`;
    $('#list')[0].innerHTML += `<h4>Result: ${results[i].text}</h4>`;
  }
  for(var i = 0; i < answers.length; i++){
    $('#answers')[0].innerHTML += `<option value="${answers[i].id}">${answers[i].text} (${questions[getQuestion(answers[i].displayQuestion)].text})</option>`;
    console.log(answers[i]);
    if(getFeedback(answers[i].linksTo) != -1){
      if(getQuestion(feedbacks[getFeedback(answers[i].linksTo)].linksTo) != -1){
        $("#question" + answers[i].displayQuestion)[0].innerHTML += `<h5>- ${answers[i].text} (links to Question: ${questions[getQuestion(feedbacks[getFeedback(answers[i].linksTo)].linksTo)].text} via feedback)</h5>`;
      }
      else{
        $("#question" + answers[i].displayQuestion)[0].innerHTML += `<h5>- ${answers[i].text} (links to Result: ${results[getResult(feedbacks[getFeedback(answers[i].linksTo)].linksTo)].text} via feedback)</h5>`;
      }
    }
    else{
      if(getQuestion(answers[i].linksTo) != -1){
        $("#question" + answers[i].displayQuestion)[0].innerHTML += `<h5>- ${answers[i].text} (links to Question: ${questions[getQuestion(answers[i].linksTo)].text})</h5>`;
      }
      else{
        $("#question" + answers[i].displayQuestion)[0].innerHTML += `<h5>- ${answers[i].text} (links to Result: ${results[getResult(answers[i].linksTo)].text})</h5>`;
      }
    }
  }
}

function exportToJson(){
  var toOutput = [questions, results, answers, feedbacks];
  var jsonOutput = JSON.stringify(toOutput);
  var data = "text/json;charset=utf-8," + encodeURIComponent(jsonOutput);
  $('#downloadButton').prop("href", `data:${data}`);
  $('#downloadButton').innerHTML = "Regenerate JSON";
}

function importFile(){
  var files = document.getElementById('selectFile').files;
  if (files.length <= 0) {
    return false;
  }

  var fr = new FileReader();

  fr.onload = function(e) {
    var result = JSON.parse(e.target.result);
    var formatted = JSON.stringify(result, null, 2);
    questions = result[0];
    results = result[1];
    answers = result[2];
    feedbacks = result[3];
    updateSelections();
  }

  fr.readAsText(files.item(0));
}

$(document).ready(function(){
  $('#addQuestion').click(function(){
    var text = $('#newQuestionText')[0].value.trim();
    var description = $('#newQuestionDesc')[0].value.trim();
    if(text != ""){
      $('#questionTextVal').addClass("hidden");
      $('#questionSuccess').removeClass("hidden");
      setTimeout(function(){
        $('#questionSuccess').animate({opacity:'0'}, 500, function(){
          $('#questionSuccess').addClass("hidden");
          $('#questionSuccess')[0].style.opacity = 1;
        });
      }, 500);
      var questionID = addQuestion(text, description);
      updateSelections();
      $('#newQuestionText')[0].value = "";
      $('#newQuestionDesc')[0].value = "";
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
        $('#resultSuccess').animate({opacity:'0'}, 500, function(){
          $('#resultSuccess').addClass("hidden");
          $('#resultSuccess')[0].style.opacity = 1;
        });
      }, 500);
      var resultID = addResult(text, description);
      updateSelections();
      $('#newResultText')[0].value = "";
      $('#newResultDesc')[0].value = "";
    }
    else{
      $('#resultTextVal').removeClass("hidden");
    }
  });

  $('#addAnswer').click(function(){
    var text = $('#newAnswerText')[0].value.trim();
    var display = $('#displayPage')[0].value.trim();
    var linksTo = $('#nextPage')[0].value.trim();
    var col = $('#newAnswerCol')[0].value.trim();
    var feedback = $('#newAnswerFeed')[0].value.trim();
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
        $('#answerSuccess').animate({opacity:'0'}, 500, function(){
          $('#answerSuccess').addClass("hidden");
          $('#answerSuccess')[0].style.opacity = 1;
        });
      }, 500);
      $('#newAnswerText')[0].value = "";
      $('#newAnswerFeed')[0].value = "";
      console.log(feedback);
      var answerID = addAnswer(text, display, linksTo, col, feedback);
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

  $('#deleteQuestion').click(function(){
    removeQuestion($('#questions')[0].value);
    updateSelections();
  });

  $('#deleteResult').click(function(){
    removeResult($('#results')[0].value);
    updateSelections();
  });

  $('#deleteAnswer').click(function(){
    removeAnswer($('#answers')[0].value);
    updateSelections();
  });

  $('#importButton').click(importFile);
});
