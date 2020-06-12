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
let timeLeftInSession = 1500; //25mins, this reduces as the clock counts down
let breakSession = 300; //5mins, it can be changed as needed
let sessionType = "Work"; //Is this a work or break session?
let timeSpentInCurrentSession = 0; //This increases for every second spent in the currentSession
let currentTaskTag = document.querySelector("#pomodoro-task");

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
        //timeLeftInSession--;
        toggleSessionType();
        displayTimeLeftInSession();
      }, 1000);
    }
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
  pomoTimer.innerText = timeDisplayed.toString();
}

//Function to stop the clock from running
function stopClockRunning() {
  displaySessionLog(sessionType);
  // 1) reset the timer
  clearInterval(clockStartRunning);
  // 2) update our variable to reflect that the timer is stopped
  isClockRunning = false;
  // set the timer back to the original value
  timeLeftInSession = workSession;
  timeSpentInCurrentSession = 0;
  // update the timer display
  displayTimeLeftInSession();
  sessionType = "Work";
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
      type = "Break";
      currentTaskTag.value = "Break";
      currentTaskTag.disabled = true;
    } else {
      timeLeftInSession = workSession;
      sessionType = "Work";
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
