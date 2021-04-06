import cn from "classnames";
import { useState } from "react";
import { Observable } from "rxjs";

const Timer = () => {
  const step = () => {
    var dt = Date.now() - expected; // the drift (positive for overshooting)
    if (dt > interval) {
      // something really bad happened. Maybe the browser (tab) was inactive?
      // possibly special handling to avoid futile "catch up" run
    }
    expected += interval;
    setTimeout(step, Math.max(0, interval - dt)); // take into account drift
  };
  return new Observable((subscriber) => {
    setInterval();
    subscriber.next();
  });
};

const parseHours = (callback) => (time) => {
  const hours = Math.floor(time / (1000 * 60 * 60));
  callback(hours);
};

const parseMinutes = (callback) => (time) => {
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  callback(minutes);
};

const parseSeconds = (callback) => (time) => {
  const seconds = Math.floor((time % (1000 * 60)) / 1000);
  callback(seconds);
};

const TimerComponent = () => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isTimerStopped, setIsTimerStopped] = useState(false);
  const [seconds, setSeconds] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [hours, setHours] = useState("00");

  const handleHoursChange = (hours) => {
    setHours(("0" + hours).slice(-2));
  };
  const handleMinutesChange = (minutes) => {
    setMinutes(("0" + minutes).slice(-2));
  };
  const handleSecondsChange = (seconds) => {
    setSeconds(("0" + seconds).slice(-2));
  };

  const handleStartStopClick = () => {
    if (isTimerActive) timer.reset();
    else timer.start();
    setIsTimerActive(!isTimerActive);
  };

  const handleWaitClick = (() => {
    let t1;
    let firstClick = true;
    return (e) => {
      if (firstClick) {
        t1 = e.timeStamp;
        firstClick = false;
        setTimeout(() => (firstClick = true), 300);
      } else if (e.timeStamp - t1 < 300) {
        timer.stop();
      }
    };
  })();

  const handleRestartClick = () => {
    timer.restart();
  };

  const timer = new Timer(
    parseSeconds(handleSecondsChange),
    parseMinutes(handleMinutesChange),
    parseHours(handleHoursChange)
  );

  return (
    <section className="timer">
      <h2 className="timer__heading"></h2>
      <div className="timer__digits">
        <span className="timer__digit">{hours}</span>:
        <span className="timer__digit">{minutes}</span>:
        <span className="timer__digit">{seconds}</span>
      </div>
      <div className="timer__buttons">
        <button
          className={cn("timer__button ", {
            "timer__button--start": !isTimerActive,
            "timer__button--stop": isTimerActive,
          })}
          onClick={handleStartStopClick}
        ></button>
        <button
          className={cn("timer__button ", "timer__button--wait", {
            "timer__button--disabled": !isTimerActive,
          })}
          disabled={!isTimerActive}
          onClick={handleWaitClick}
        ></button>
        <button
          className={cn("timer__button ", "timer__button--restart", {
            "timer__button--disabled": !isTimerActive,
          })}
          disabled={!isTimerActive}
          onClick={handleRestartClick}
        ></button>
      </div>
    </section>
  );
};

export default TimerComponent;
