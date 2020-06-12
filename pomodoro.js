//SELECT THE ELEMENTS FROM THE DOM THAT ARE NEEDED IN THIS SCRIPT
const pomoTimer = document.querySelector("#pomodoro-timer");
const startClock = document.querySelector("#pomodoro-start");
const pauseClock = document.querySelector("#pomodoro-pause");
const stopClock = document.querySelector("#pomodoro-stop");

//Variable Declarations

//We need to know if the clock is already running before deciding what to do
let isClockRunning = false;

//Work sessionTime
let workSession = 1500; //25mins
let timeLeftInWorkSession = 1500; //25mins, this reduces as the clock counts down
let breakSession = 300; //5mins, it can be changed as needed

// Attach event listeners to all three buttons
// START CLOCK BUTTON
startClock.addEventListener("click", () => {
  //alert("Hey! I start the clock");
  whatShouldIDo();
});

// PAUSE CLOCK BUTTON
pauseClock.addEventListener("click", () => {
  //alert("Hey! I pause the clock");
  whatShouldIDo();
});

// STOP CLOCK BUTTON
stopClock.addEventListener("click", () => {
  //alert("I stop the clock completely");
  whatShouldIDo(true); //I wanna stop the clock when its already running
});

//Pomodoro App Functions
function whatShouldIDo(reset) {
  //Defines what should be done when each button is clicked
  if (reset) {
    //FUNCTION TO STOP THE TIMER AND MAYBE RESET THE DURATION OF THE CLOCK
  } else {
    if (isClockRunning === true) {
      //FUNCTION TO PAUSE THE CLOCK
      clearInterval(clockStartRunning);
      isClockRunning = false;
    } else {
      //The clock is now running
      isClockRunning = true;
      //FUNCTION TO START THE CLOCK
      clockStartRunning = setInterval(() => {
        // decrease time left in workSessionBy 1 for each second
        timeLeftInWorkSession--;
        displayTimeLeftInSession();
      }, 1000);
    }
  }
}

//Function displayTimeLeftInSession
function displayTimeLeftInSession() {
  //this is in seconds
  const secondsLeft = timeLeftInWorkSession;
  let timeDisplayed = "";
  //No of seconds
  const seconds = secondsLeft % 60;
  //no of mins
  const minutes = parseInt(secondsLeft / 60) % 60;
  //no of hours
  let hours = parseInt(secondsLeft / 3600);
  // add leading zeroes if it's less than 10
  function addLeadingZeroes(time) {
    return time < 10 ? `0${time}` : time;
  }
  if (hours > 0) timeDisplayed += `${hours}:`;
  timeDisplayed += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
  pomoTimer.innerText = timeDisplayed.toString();
}
