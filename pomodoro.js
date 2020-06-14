//Dom Element selection
const pomoTimer = document.querySelector("#pomodoro-timer");
const startClock = document.querySelector("#pomodoro-start");
const pauseClock = document.querySelector("#pomodoro-pause");
const stopClock = document.querySelector("#pomodoro-stop");

//Variable Declarations
let isClockRunning = false; //Clock is not running
let isClockStopped = true; //Clock is stopped
let workSession = 1500; //25mins
let timeLeftInSession = 1500; //25mins
let breakSession = 300; //5mins
let sessionType = "Work"; //Is this a work or break session?
let timeSpentInCurrentSession = 0; //This increases for every second spent in the currentSession
let currentTaskTag = document.querySelector("#pomodoro-task");
let newWorkSession;
let newBreakSession;
let inputWorkTime = document.querySelector("#input-work-duration");
let inputBreakTime = document.querySelector("#input-break-duration");
inputWorkTime.value = "25";
inputBreakTime.value = "5";

//ProgressBar Variables : For styling
const progressBar = new ProgressBar.Circle("#pomodoro-timer", {
  strokeWidth: 3,
  text: {
    value: "25:00",
  },
  trailColor: "white",
});

// Attach click event listeners to buttons
startClock.addEventListener("click", () => {
  whatShouldIDo();
});

pauseClock.addEventListener("click", () => {
  whatShouldIDo();
  //alert("I pause the clock!");
});

stopClock.addEventListener("click", () => {
  whatShouldIDo(true); //I wanna stop the clock when its already running
});

// Attach input event listeners to the inputs
inputWorkTime.addEventListener("input", () => {
  newWorkSession = minuteToSeconds(inputWorkTime.value);
});

inputBreakTime.addEventListener("input", () => {
  newBreakSession = minuteToSeconds(inputBreakTime.value);
});

//POMODORO APP FUNCTIONS
//1. Function change minutes from input in string to seconds
const minuteToSeconds = (mins) => {
  return mins * 60;
};

//2. Function to toggle the play and pause button
const togglePlayPause = (reset) => {
  const playBtn = document.querySelector("#play-icon");
  const pauseBtn = document.querySelector("#pause-icon");
  if (reset) {
    if (playBtn.classList.contains("hidden")) {
      playBtn.classList.remove("hidden");
    }
    if (!pauseBtn.classList.contains("hidden")) {
      pauseBtn.classList.add("hidden");
    }
  } else {
    playBtn.classList.toggle("hidden");
    pauseBtn.classList.toggle("hidden");
  }
};

//3. Function that decides what should be done on button clicks
const whatShouldIDo = (reset) => {
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
};

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
