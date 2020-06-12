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
let sessionType = "Work"; //Is this a work or break session?
let timeSpentInCurrentSession = 0; //This increases for every second spent in the currentSession

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
    stopClockRunning();
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
        //timeLeftInWorkSession--;
        toggleSessionType();
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

//Function to stop the clock from running
function stopClockRunning() {
  // 1) reset the timer
  clearInterval(clockStartRunning);
  // 2) update our variable to reflect that the timer is stopped
  isClockRunning = false;
  // set the timer back to the original value
  timeLeftInWorkSession = workSession;
  // update the timer display
  displayTimeLeftInSession();
}

//Function to toggle between work and break sessions
function toggleSessionType() {
  if (timeLeftInWorkSession > 0) {
    //keep counting down
    timeLeftInWorkSession--;
  } else if (timeLeftInWorkSession === 0) {
    //timer is over, toggle work and break sessions
    if (sessionType === "Work") {
      //Update the timeLeft to the breakSession Duration
      timeLeftInWorkSession = breakSession;
      displaySessionLog("Work");
      //update the sessionType to break
      type = "Break";
    } else {
      timeLeftInWorkSession = workSession;
      type = "Work";
      displaySessionLog("Break");
    }
  }
  displayTimeLeftInSession();
}
