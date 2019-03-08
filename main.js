const clock = document.querySelector(".clock");
const start = document.querySelector(".start");
const stop = document.querySelector(".stop");
const plus = document.querySelector(".plus");
const minus = document.querySelector(".minus");
const audio = document.querySelector(".audio");
const slice = document.querySelector(".slice");

let clockOn = false;
let setTime = 0;
let startButtonClickTime = 0;
let stopButtonClickTime = 0;
let difference = 0;
let resetState = false;
let intervalId;

const toReadableConverter = ms => {
  let milliseconds = parseInt(ms % 1000);
  let seconds = parseInt(((ms / 1000) * 1) % 60);
  let minutes = parseInt((ms / (1000 * 60)) % 60);
  let hours = parseInt((ms / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  if (milliseconds < 10) {
    milliseconds = "00" + milliseconds;
  } else if (milliseconds < 100) {
    milliseconds = "0" + milliseconds;
  } else {
    milliseconds;
  }

  const timeFormat =
    hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
  return timeFormat;
};
const sliceStyle = () => {
  slice.style.backgroundImage = `linear-gradient(90deg, white 50%, transparent 50%),
		 linear-gradient(-90deg, white 50%, transparent 50%)`;
};
const countDownClock = (setTimeParam, startButtonClickTimeParam) => {
  difference =
    stopButtonClickTime === 0
      ? setTimeParam + startButtonClickTimeParam - new Date().getTime()
      : stopButtonClickTime + startButtonClickTimeParam - new Date().getTime();
  clock.textContent = toReadableConverter(difference);

  let percentOfClock = 270 - (difference * 360) / setTime;
  if (percentOfClock >= -90 && percentOfClock <= 90) {
    slice.style.backgroundImage = `linear-gradient(${percentOfClock}deg, white 50%, transparent 50%),
			 linear-gradient(-90deg, transparent 50%, white 50%)`;
  } else {
    slice.style.backgroundImage = `linear-gradient(${percentOfClock}deg, transparent 50%, #FF4855 50%),
			 linear-gradient(-90deg, transparent 50%, white 50%)`;
  }

  // Audio when 10 sec left
  if (difference <= 10200 && difference > 100) {
    audio.play();
    audio.volume = 0.2;
  }
  if (difference <= 0) {
    clockOn = false;
    clearInterval(intervalId);
    setTime = 0;
    difference = 0;
    resetState = false;
  }

  return difference;
};

plus.addEventListener("click", () => {
  if (!clockOn && stopButtonClickTime === 0) {
    setTime += 60000;
    clock.textContent = toReadableConverter(setTime);
  } else if (!clockOn && difference > 0) {
    stopButtonClickTime += 60000;
    setTime = stopButtonClickTime;
    clock.textContent = toReadableConverter(setTime);
  }
  if (!clockOn) {
    stop.textContent = "RESET";
  }
});
minus.addEventListener("click", () => {
  if (!clockOn && setTime >= 60000 && difference === 0) {
    setTime -= 60000;
    clock.textContent = toReadableConverter(setTime);
  } else if (!clockOn && setTime >= 60000 && difference >= 60000) {
    stopButtonClickTime -= 60000;
    setTime = stopButtonClickTime;
    clock.textContent = toReadableConverter(setTime);
  }
});
start.addEventListener("click", () => {
  if (!clockOn && setTime !== 0) {
    clockOn = !clockOn;
    startButtonClickTime = new Date().getTime();
    intervalId = setInterval(
      countDownClock,
      100,
      setTime,
      startButtonClickTime
    );

    resetState = false;
    stop.textContent = "STOP";
  }
});
stop.addEventListener("click", () => {
  if (!resetState && difference !== 0) {
    clockOn = !clockOn;
    stopButtonClickTime = difference;
    clearInterval(intervalId);

    audio.pause();
    audio.currentTime = 0;

    resetState = !resetState;
    stop.textContent = "RESET";
  } else if (difference <= 0) {
    sliceStyle();
    clockOn = false;
    resetState = false;
    stop.textContent = "STOP";
    stopButtonClickTime = 0;
    setTime = 0;
    difference = 0;
  } else {
    sliceStyle();
    clockOn = false;
    resetState = false;
    stop.textContent = "STOP";
    stopButtonClickTime = 0;
    setTime = 0;
    difference = 0;
    clock.textContent = toReadableConverter(setTime);
  }
});
