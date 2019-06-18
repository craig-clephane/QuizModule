var questions = [];
var results = [];
var answers = [];
var questionArea;
var answerArea;
var activeDisplayID;

function interpretQuiz(data){
  questions = data[0];
  activeDisplayID = questions[0].id;
  results = data[1];
  answers = data[2];
  updateDisplay();
}

function getQuiz(quizURL){
  $.ajax({
    url: quizURL,
    type: 'GET',
    dataType: "json",
    success: interpretQuiz
  });
}

function inIframe(){
  try{
    return window.self !== window.top;
  }
  catch(e){
    return true;
  }
}

$(document).ready(function(){
  questionArea = $('#questionArea')[0];
  answersArea = $('#answersArea')[0];
  $.getJSON('https://dinkieshy.github.io/QuizModule/quiz.json', interpretQuiz);
});

function updateDisplay(){
  var activeQuestion = getQuestion(activeDisplayID);
  if(activeQuestion == -1){
    //display result
    $('#questionArea').addClass('hidden');
    $('#answersArea').addClass('hidden');
    $('#resultsArea').removeClass('hidden');
    resultsArea.innerHTML = `<h3 class="resultDisplay">${results[getResult(activeDisplayID)].text}</h3><p class="resultDescription">${results[getResult(activeDisplayID)].description}</p>`;
  }
  else{
    //display question/answer
    questionArea.innerHTML = `<h3 class="questionDisplay">${questions[activeQuestion].text}</h3><p class="questionDescription">${questions[getQuestion(activeDisplayID)].description}</p>`;
    answersArea.innerHTML = "";
    for(var i = 0; i < questions[activeQuestion].answers.length; i++){
      answersArea.innerHTML += `<button class="btn" id="${questions[activeQuestion].answers[i]}" onclick="showNext(event)">${answers[getAnswer(questions[activeQuestion].answers[i])].text}</button>`;
    }
  }
}

function showNext(event){
  var answer = answers[getAnswer(event.currentTarget.id)];
  activeDisplayID = answer.linksTo;
  updateDisplay();
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
