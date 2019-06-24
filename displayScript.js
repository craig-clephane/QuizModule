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
  if(inIframe()){
    var quizURL = window.location.search.slice(5);
    console.log(window.location.search.slice(5));
    $.getJSON(quizURL, interpretQuiz);
  }
  else{
    var quizURl = window.prompt("Please enter a link to a quiz json file (leave blank for demo)");
    if(quizURL == ""){
      $.getJSON('https://dinkieshy.github.io/QuizModule/quiz.json', interpretQuiz);
    }
    else{
      $.getJSON(quizURL, interpretQuiz);
    }
  }
});

function updateDisplay(){
  var activeQuestion = getQuestion(activeDisplayID);
  var activeResult = getResult(activeDisplayID);
  if(activeQuestion == -1){
    //display result
    $('#questionArea').addClass('hidden');
    $('#answersArea').addClass('hidden');
    $('#resultsArea').removeClass('hidden');
    resultsArea.innerHTML = `<h3 class="resultDisplay">${results[activeResult].text}</h3>`;
    if(results[activeResult].description != "" && results[activeResult].description != undefined){
      resultsArea.innerHTML += `<p class="resultDescription">${results[activeResult].description}</p>`;
    }
  }
  else{
    //display question/answer
    questionArea.innerHTML = `<h3 class="questionDisplay">${questions[activeQuestion].text}</h3>`;
    if(questions[activeQuestion].description != "" && questions[activeQuestion].description != undefined){
      questionArea.innerHTML += `<p class="questionDescription">${questions[getQuestion(activeDisplayID)].description}</p>`;
    }
    answersArea.innerHTML = "";
    for(var i = 0; i < questions[activeQuestion].answers.length; i++){
      answersArea.innerHTML += `<button class="btn answerButton" id="${questions[activeQuestion].answers[i]}" onclick="showNext(event)">${answers[getAnswer(questions[activeQuestion].answers[i])].text}</button>`;
    }
    scrollToMiddle();
  }
}

function scrollToMiddle(){
  var outerContent = $('#answersArea');
  var innerContent = $('#answersArea > .answerButton');
  outerContent.scrollLeft((innerContent.width() - outerContent.width()) / 2);
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
