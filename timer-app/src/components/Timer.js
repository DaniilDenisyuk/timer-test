import cn from "classnames";
import { useState } from "react";
import { Subject } from "rxjs";

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

function Timer(...observers) {
  const timerSubject = new Subject();
  observers.forEach((observer) => timerSubject.subscribe(observer));

  let interval = 1000;
  let timeout;
  let startTime;
  let elapsedTime;
  let expected;
  const step = () => {
    const now = Date.now();
    var dt = now - expected;
    if (dt > interval) {
    }
    timerSubject.next(now - startTime);
    console.log(timeout);
    expected += interval;
    timeout = setTimeout(step, Math.max(0, interval - dt));
  };

  const start = () => {
    const now = Date.now();
    expected = now + interval;
    startTime = now;
    timeout = setTimeout(step, interval);
  };
  const stop = () => {
    clearTimeout(timeout);
    elapsedTime = Date.now() - startTime;
  };
  const reset = () => {
    clearTimeout(timeout);
    timerSubject.next(0);
  };
  const restart = () => {
    clearTimeout(timeout);
    timerSubject.next(0);
    startTime = Date.now();
    timeout = setTimeout(step, 0);
  };
  const resume = () => {
    startTime = Date.now() - elapsedTime;
    timeout = setTimeout(step, interval);
  };
  return {
    reset,
    start,
    stop,
    restart,
    resume,
  };
}

const TimerComponent = () => {
  const [timer] = useState(
    new Timer(
      parseSeconds(handleSecondsChange),
      parseMinutes(handleMinutesChange),
      parseHours(handleHoursChange)
    )
  );
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isTimerStopped, setIsTimerStopped] = useState(false);
  const [seconds, setSeconds] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [hours, setHours] = useState("00");

  async function handleHoursChange(hours) {
    setHours(("0" + hours).slice(-2));
  }
  async function handleMinutesChange(minutes) {
    setMinutes(("0" + minutes).slice(-2));
  }
  async function handleSecondsChange(seconds) {
    setSeconds(("0" + seconds).slice(-2));
  }

  const handleStartStopClick = () => {
    if (isTimerStopped) {
      console.log("resume");
      timer.resume();
      setIsTimerStopped(false);
      return;
    }
    if (isTimerActive) {
      console.log("reset");
      timer.reset();
    } else {
      console.log("start");
      timer.start();
    }
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
        setIsTimerStopped(true);
      }
    };
  })();

  const handleRestartClick = () => {
    timer.restart();
  };

  return (
    <section className="timer">
      <h2 className="timer__heading">Таймер</h2>
      {isTimerStopped ? (
        <p className="timer__info">Таймер остановлен</p>
      ) : isTimerActive ? (
        <p className="timer__info">Таймер запущен</p>
      ) : (
        <p className="timer__info">Таймер не запущен</p>
      )}
      <div className="timer__digits">
        <span className="timer__digit">{hours}</span>:
        <span className="timer__digit">{minutes}</span>:
        <span className="timer__digit">{seconds}</span>
      </div>
      <div className="timer__buttons">
        <button
          className={cn("timer__button ", {
            "timer__button--start": !isTimerActive || isTimerStopped,
            "timer__button--stop": isTimerActive && !isTimerStopped,
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
