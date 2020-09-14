// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount=0;
let equationsArray = [];
let playerGuessArray=[];
                                 let bestScoresArray=[];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed=0;
let baseTime=0;
let penaltyTime=0;
let finalTime=0;
       let finalTimeDisplay='0.0';
// Scroll
let valueY=0;
//Refresh splash page best Scores
   function bestScoresToDOM(){
  bestScores.forEach((bestScore , index)=> {
  const bestScoreEl=bestScore;
 bestScoreEl.textContent=`${bestScoresArray[index].bestScore}s`;
     });
}
//check Local storage for best score,set bestScoresArray
function getSavedBestScores(){
  if(localStorage.getItem('bestScores')){
    bestScoresArray=JSON.parse(localStorage.bestScores);
  }else{
     bestScoresArray=[
                  {questions:10,bestScore:finalTimeDisplay},
       {questions: 25, bestScore:  finalTimeDisplay},
       {questions: 50, bestScore:  finalTimeDisplay},
       {questions: 99, bestScore:  finalTimeDisplay},
     ];
     localStorage.setItem('bestScores',JSON.stringify(bestScoresArray));
  }
                                     bestScoresToDOM();
}
//Update Best Scores
function updateBestScore(){
  bestScoresArray.forEach((score,index)=>{
   //select Best  score to update
   if(questionAmount==score.questions){
     //Return te best score
                const SavedBestScore=Number(bestScoresArray[index].bestScore);
                //update if the new final score is less or replacing zero
                if(SavedBestScore==0 || SavedBestScore > finalTime){
                  bestScoresArray[index].bestScore=finalTimeDisplay;
                }
              }
  });
  //updatesplash page,save to localstorage
  bestScoresToDOM();
  localStorage.setItem('bestScores',JSON.stringify(bestScoresArray));
}
// Reset the game
function playAgain(){
  gamePage.addEventListener('click',startTimer);
  scorePage.hidden=true;
  splashPage.hidden=false;
  equationsArray=[];
  playerGuessArray=[];
  valueY=0;
  playAgainBtn.hidden=true;
}
//Show Score page
function showScorePage(){
  //show playAgainbtn
 setTimeout(()=>{
 playAgainBtn.hidden=false;
 },1000);
  gamePage.hidden=true;
  scorePage.hidden=false;
}
//Scores to DO?M
function scoresToDOM(){
  finalTimeDisplay=finalTime.toFixed(1);
  baseTime=timePlayed.toFixed(1);
  penaltyTime=penaltyTime.toFixed(1);
  baseTimeEl.textContent=`Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent=`Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent=`${finalTimeDisplay}s`;
  updateBestScore();
  //Scrollto top,go to Score page
  itemContainer.scrollTo({ top:0, behavior:'instant'});
  showScorePage();

}
//stop Timer ,process Result,go to score page
function checkTime(){
  console.log(timePlayed);
  if(playerGuessArray.length==questionAmount){
    console.log('player guess array:',playerGuessArray);
    clearInterval(timer);
    //check for wrong guesses and add penalty time
    equationsArray.forEach((equation,index)=>{
    if(equation.evaluated===playerGuessArray[index]){
      //correct guess no penalty

      
    }else{
       //incorrect guess,penalty time
       penaltyTime += 0.5;
    }
    });
    finalTime=timePlayed+penaltyTime;
    console.log('time: ',timePlayed,'penalty: ',penaltyTime,'final: ',finalTime);
    scoresToDOM();
  }
}
//add a tenth of a second to a timePlayed
function aadTime(){
   timePlayed+=0.1;
   checkTime();
}
//Start timer when game page is clicked
function startTimer(){
  //Reset times
  timePlayed=0;
  penaltyTime=0;
  finalTime=0;
   timer=setInterval(aadTime,100);
   gamePage.removeEventListener('click',startTimer);
}
//Scroll,store user selection in playerguessarray
function select(guessedTrue){
  
// scroll 80mpixels
valueY += 80;
itemContainer.scroll(0,valueY);
//add  player guess to array
return guessedTrue ?playerGuessArray.push('true'):playerGuessArray.push('false');
}
//Display Game page
function showGamePage(){
  gamePage.hidden=false;
  countdownPage.hidden=true;
}
//Get Random number up to max
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log('correct equations:',correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount-correctEquations;
  console.log('wrong equations:',wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
  
}
//Add Equations to DOM
function equationsToDOM(){
  equationsArray.forEach((equation)=>{
    //Item
    const item=document.createElement('div');
    item.classList.add('item');
    //equation text
    const equationText=document.createElement('h1');
    equationText.textContent=equation.value;
    //Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
createEquations();
equationsToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}
//Disploay 3,2,1,Go!
function countdownStart(){
  countdown.textContent='3';
   setTimeout(()=>{
   countdown.textContent='2';
            },1000);
      setTimeout(()=>{
   countdown.textContent='1';
      },2000);
   setTimeout(()=>{
    countdown.textContent='GO!';
       },3000);
       }
//Navigate from splash pagev to countdown page
function showCountdown(){
  countdownPage.hidden=false;
  splashPage.hidden=true;
  countdownStart();
 populateGamePage();
  setTimeout(showGamePage,4000);
}
//Get the value from our selected radio button
function getRadioValue(){
    let  radioValue;
  radioInputs.forEach((radioInput)=>{
if (radioInput.checked){
   radioValue=radioInput.value;
   
 }
  });
  return radioValue;
}
//Form that decides amount of questions
function selectQuestionAmount(e){
        e.preventDefault();
        questionAmount=getRadioValue();
        console.log('question amount: ',questionAmount);
       if(questionAmount){
          showCountdown();
       }
}
startForm.addEventListener('click',()=>{
           radioContainers.forEach((radioEL)=>{
    //Remove Selected label Styling
           radioEL.classList.remove('selected-label');
    //Add it back if radio input is checked
               if(radioEL.children[1].checked){
             radioEL.classList.add('selected-label');
    }
   });
});
// Event Listners
startForm.addEventListener('submit',selectQuestionAmount);
gamePage.addEventListener('click',startTimer);
//On Load
                                  getSavedBestScores();