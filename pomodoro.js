//SELECT THE ELEMENTS FROM THE DOM THAT ARE NEEDED IN THIS SCRIPT
const pomoTimer = document.querySelector("#pomodoro-timer");
const startClock = document.querySelector("#pomodoro-start");
//const pauseClock = document.querySelector("#pomodoro-pause");
const stopClock = document.querySelector("#pomodoro-stop");

//Variable Declarations

//We need to know if the clock is already running before deciding what to do
let isClockRunning = false;
let isClockStopped = true;

//Work sessionTime
let workSession = 1500; //25mins
let timeLeftInSession = 1500; //25mins, this reduces as the clock counts down
let breakSession = 300; //5mins, it can be changed as needed
let sessionType = "Work"; //Is this a work or break session?
let timeSpentInCurrentSession = 0; //This increases for every second spent in the currentSession
let currentTaskTag = document.querySelector("#pomodoro-task");

//This holds the new values that will be applied at the beginning of a new session
let newWorkSession;
let newBreakSession;

let workTime = document.querySelector("#input-work-duration");
let breakTime = document.querySelector("#input-break-duration");

workTime.value = "25"; //just set it to a string of 25mins
breakTime.value = "5"; //set to a string of 5mins

//ProgressBar Variables
const progressBar = new ProgressBar.Circle("#pomodoro-timer", {
  strokeWidth: 2,
  text: {
    value: "25:00",
  },
  trailColor: "white",
});

// Attach event listeners to all three buttons

// START CLOCK BUTTON
startClock.addEventListener("click", () => {
  //alert("Hey! I start the clock");
  whatShouldIDo();
});

// PAUSE CLOCK BUTTON : NO LONGER NECESSARY AS WE ARE JUST TOGGLING
pauseClock.addEventListener("click", () => {
  //alert("Hey! I pause the clock");
  whatShouldIDo();
});

// STOP CLOCK BUTTON
stopClock.addEventListener("click", () => {
  //alert("I stop the clock completely");
  whatShouldIDo(true); //I wanna stop the clock when its already running
});

// UPDATED WORK TIME
workTime.addEventListener("input", () => {
  newWorkSession = minuteToSeconds(workTime.value);
});

// UPDATE PAUSE TIME
breakTime.addEventListener("input", () => {
  newBreakSession = minuteToSeconds(breakTime.value);
});

//POMODORO APP FUNCTIONS
function whatShouldIDo(reset) {
  togglePlayPause(reset);
  //Defines what should be done when each button is clicked
  if (reset) {
    //FUNCTION TO STOP THE TIMER AND MAYBE RESET THE DURATION OF THE CLOCK
    stopClockRunning();
  } else {
    if (isClockStopped) {
      setUpdatedTimers();
      isClockStopped = false;
    }
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
        //timeLeftInSession--;
        toggleSessionType();
        displayTimeLeftInSession();
        progressBar.set(calculateSessionProgress());
      }, 1000);
      isClockRunning = true;
    }
    showStopIcon();
  }
}

//Function displayTimeLeftInSession
function displayTimeLeftInSession() {
  //this is in seconds
  const secondsLeft = timeLeftInSession;
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
  progressBar.text.innerText = timeDisplayed.toString();
  // pomoTimer.innerText = timeDisplayed.toString();
}

//Function to stop the clock from running
function stopClockRunning() {
  setUpdatedTimers();
  displaySessionLog(sessionType);
  // 1) reset the timer
  clearInterval(clockStartRunning);
  isClockStopped = true;
  // 2) update our variable to reflect that the timer is stopped
  isClockRunning = false;
  // set the timer back to the original value
  timeLeftInSession = workSession;
  // update the timer display
  displayTimeLeftInSession();
  sessionType = "Work";
  timeSpentInCurrentSession = 0;
}

//Function to toggle between work and break sessions
function toggleSessionType() {
  if (timeLeftInSession > 0) {
    //keep counting down
    timeLeftInSession--;
    timeSpentInCurrentSession++;
  } else if (timeLeftInSession === 0) {
    timeSpentInCurrentSession = 0;
    //timer is over, toggle work and break sessions
    if (sessionType === "Work") {
      //Update the timeLeft to the breakSession Duration
      timeLeftInSession = breakSession;
      displaySessionLog("Work");
      //update the sessionType to break
      sessionType = "Break";
      setUpdatedTimers();
      currentTaskTag.value = "Break";
      currentTaskTag.disabled = true;
    } else {
      timeLeftInSession = workSession;
      sessionType = "Work";
      setUpdatedTimers();
      if (currentTaskTag.value === "Break") {
        currentTaskTag.value = workSessionLabel;
      }
      currentTaskTag.disabled = false;
      displaySessionLog("Break");
    }
  }
  displayTimeLeftInSession();
}

//Function to display session log
function displaySessionLog(sessionType) {
  const pomoSessions = document.querySelector("#pomodoro-sessions");
  //Append list item
  const li = document.createElement("li");
  if (sessionType === "Work") {
    sessionTag = currentTaskTag.value ? currentTaskTag.value : "Work";
    workSessionLabel = sessionTag;
  } else {
    sessionTag = "Break";
  }
  //let sessionTag = sessionType;
  let elapsedTime = parseInt(timeSpentInCurrentSession / 60);
  elapsedTime = elapsedTime > 0 ? elapsedTime : "<1";
  const text = document.createTextNode(`${sessionTag} : ${elapsedTime} min`);
  li.appendChild(text);
  pomoSessions.appendChild(li);
}

//Function to updateTimer to what the UserInputs
//1. Check to see if there's an updated session duration for work and break
//2. If yes, it sets the new work and break sessions to that value
function setUpdatedTimers() {
  if (sessionType === "Work") {
    timeLeftInSession = newWorkSession ? newWorkSession : workSession;
    workSession = timeLeftInSession;
  } else {
    timeLeftInSession = newBreakSession ? newBreakSession : breakSession;
    breakSession = timeLeftInSession;
  }
}

//Function to change the string minutes to seconds
const minuteToSeconds = (mins) => {
  return mins * 60;
};

//Function to toggle the play and pause button
function togglePlayPause(reset) {
  const playBtn = document.querySelector("#play-icon");
  const pauseBtn = document.querySelector("#pause-icon");
  //If clock is reset as a result of stopping it or pausing it, then do this
  if (reset) {
    //We need to start the clock again
    if (playBtn.classList.contains("hidden")) {
      playBtn.classList.remove("hidden");
    }
    if (!pauseBtn.classList.contains("hidden")) {
      pauseBtn.classList.add("hidden");
    }
  } else {
    //The clock is running and we can toggle between pause and play
    playBtn.classList.toggle("hidden");
    pauseBtn.classList.toggle("hidden");
  }
}

//Function to show stop button
function showStopIcon() {
  const stopBtn = document.querySelector("#pomodoro-stop");
  stopBtn.classList.remove("hidden");
}

//Function to display the progress bar
function calculateSessionProgress() {
  //How fast is the session completing
  const sessionDuration = sessionType === "Work" ? workSession : breakSession;
  return (timeSpentInCurrentSession / sessionDuration) * 10;
}
