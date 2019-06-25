var questions = [];
var results = [];
var answers = [];
var feedbacks = [];
var responses = [];
var questionArea;
var answerArea;
var activeDisplayID;
var endURL;
var rCount = 0;
var oCount = 0;
var gCount = 0;

function interpretQuiz(data){
  questions = data[0];
  activeDisplayID = questions[0].id;
  results = data[1];
  answers = data[2];
  feedbacks = data[3];
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
    var input = parseQueryString(window.location.search.slice(1));
    var quizURL = input.url;
    endURL = input.endURL;
    $.getJSON(quizURL, interpretQuiz);
  }
  else{
    var quizURL = window.prompt("Please enter a link to a quiz json file (leave blank for demo)");
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
  var activeFeedback = getFeedback(activeDisplayID);
  if(activeResult != -1){
    //display result
    $('#questionArea').addClass('hidden');
    $('#answersArea').addClass('hidden');
    $('#resultsArea').removeClass('hidden');
    if(results[activeResult].showAnswers == true){
      resultsArea.innerHTML = `<h3 class="questionDisplay">${results[activeResult].text}</h3>`;
      if(results[activeResult].description != ""){
        resultsArea.innerHTMl += `<p class="questionDescription">${results[activeResult].description}</p>`;
      }
      for(var i = 0; i < responses.length; i++){
        resultsArea.innerHTML += `<p class="answerShown" id="answer${responses[i]}">${answers[getAnswer(responses[i])].text} (${questions[getQuestion(answers[getAnswer(responses[i])].displayQuestion)].text})</p>`;
        var colour = "grey";
        switch(answers[getAnswer(responses[i])].col){
          case 'r':
            rCount++;
            colour = '#F03030';
          break;
          case 'o':
            oCount++;
            colour = '#F0A000';
          break;
          case 'g':
            gCount++;
            colour = '#30B030';
          break;
        }
        $('#answer' + responses[i]).css({"background-color":colour});
      }
    }
    else{
      resultsArea.innerHTML = `<h3 class="resultDisplay">${results[activeResult].text}</h3>`;
      if(results[activeResult].description != "" && results[activeResult].description != undefined){
        resultsArea.innerHTML += `<p class="resultDescription">${results[activeResult].description}</p>`;
      }
    }
    if(endURL == undefined){
      resultsArea.innerHTML += `<div id="quizButtons"><button class="btn" id="retryButton" onclick="retry()">Retry</button>
      <button class="btn" id="submitButton" onclick="submit()">Submit</button></div>`;
    }
    else{
      resultsArea.innerHTML += `<div id="quizButtons"><button class="btn" id="retryButton" onclick="retry()">Retry</button>
      <button class="btn" id="submitButton" href="${endURL}">Submit</button></div>`;
    }
  }
  else if(activeFeedback != -1){
    questionArea.innerHTML = `<h3 class="questionDisplay">${answers[getAnswer(feedbacks[activeFeedback].answer)].text}</h3><p class="questionDescription">${feedbacks[activeFeedback].text}</p>`;
    answersArea.innerHTML = `<button class="btn answerButton" id="${feedbacks[activeFeedback].id}" onclick="showNext(event)">Next Question</button>`;
  }
  else{
    //display question/answer
    questionArea.innerHTML = `<h3 class="questionDisplay">${questions[activeQuestion].text}</h3>`;
    if(questions[activeQuestion].description != "" && questions[activeQuestion].description != undefined){
      questionArea.innerHTML += `<p class="questionDescription">${questions[activeQuestion].description}</p>`;
    }
    answersArea.innerHTML = "";
    for(var i = 0; i < questions[activeQuestion].answers.length; i++){
      answersArea.innerHTML += `<button class="btn answerButton" id="${questions[activeQuestion].answers[i]}" onclick="showNext(event)">${answers[getAnswer(questions[activeQuestion].answers[i])].text}</button>`;
    }
  }
}

function retry(){
  activeDisplayID = questions[0].id;
  responses = [];
  updateDisplay();
  $('#questionArea').removeClass('hidden');
  $('#answersArea').removeClass('hidden');
  $('#resultsArea').addClass('hidden');
}

function submit(){
  if(endURL == "" || endURL == undefined){
    if(inIframe()){
      window.top.history.go(-1);
    }
    else{
      window.history.go(-1);
    }
  }
  else{
    if(inIframe()){
      window.top.location.href = endURL + `?Green=${gCount}&Orange=${oCount}&Red=${rCount}`;
    }
    else{
      window.location.href = endURL + `?Green=${gCount}&Orange=${oCount}&Red=${rCount}`;
    }
  }
}

function showNext(event){
  answer = getAnswer(event.currentTarget.id);
  if(answer == -1){
    activeDisplayID = feedbacks[getFeedback(event.currentTarget.id)].linksTo;
  }
  else{
    answer = answers[getAnswer(event.currentTarget.id)];
    responses.push(event.currentTarget.id);
    activeDisplayID = answer.linksTo;
  }
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

function parseQueryString(query) {
  //From https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}
