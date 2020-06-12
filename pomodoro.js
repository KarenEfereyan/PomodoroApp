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
  alert("Hey! I start the clock");
  //toggleClock();
});

// PAUSE CLOCK BUTTON
pauseClock.addEventListener("click", () => {
  alert("Hey! I pause the clock");
  //toggleClock();
});

// STOP CLOCK BUTTON
stopClock.addEventListener("click", () => {
  alert("I stop the clock completely");
  //toggleClock(true);
});

//Pomodoro App Functions
function whatShouldIDo() {
  //Defines what should be done when each button is clicked
}
