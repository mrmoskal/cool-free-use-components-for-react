import React, { useEffect, useState, useMemo } from "react";
import styles from "./CoolClockNavbarVersion.module.css";

export default function CoolClock({ widthValue = 50, widthParam = "vmin" }) {
  // vars with useMemo =>
  const daytimeBackgrounds = useMemo(() => {
    const getBackgroundPropertyFormat = (backgroundType) =>
      `var(--background-${backgroundType})`;
    return {
      morning: getBackgroundPropertyFormat("morning"),
      noon: getBackgroundPropertyFormat("noon"),
      afternoon: getBackgroundPropertyFormat("afternoon"),
      evening: getBackgroundPropertyFormat("evening"),
    };
  }, []);
  const timeSettingSetter = useMemo(() => {
    return {
      // set timeSettings values
      setTimeSettingsValues: function (
        hourStart,
        morningHourEnd,
        noonHourEnd,
        afternoonHourEnd,
        eveningHourEnd
      ) {
        return {
          hoursInDayAmount: 24, // there are 24 hours in a day
          daytime: {
            hourStart: hourStart,
            morningHourEnd: morningHourEnd,
            noonHourEnd: noonHourEnd,
            afternoonHourEnd: afternoonHourEnd,
            eveningHourEnd: eveningHourEnd,
          },
          nightime: {
            hourStart: eveningHourEnd,
            hourEnd: hourStart,
          },
        };
      },

      // setting hours of the day by developers desition
      winter: function () {
        return timeSettingSetter.setTimeSettingsValues(7, 12, 15, 16, 17);
      },
      spring: function () {
        return timeSettingSetter.setTimeSettingsValues(6, 11, 15, 17, 18);
      },
      summer: function () {
        return timeSettingSetter.setTimeSettingsValues(6, 10, 16, 18, 20);
      },
      autumn: function () {
        return timeSettingSetter.setTimeSettingsValues(6, 11, 16, 18, 19);
      },
    };
  }, []);
  const sunMoonCycleArr = useMemo(() => {
    return [
      // mapping start point and end point for sun & moon spin cycle (their both on one spinning circle)
      { start: 0, end: 60 }, // morning
      { start: 60, end: 90 }, // noon
      { start: 90, end: 120 }, // afternoon
      { start: 120, end: 180 }, // evening
      { start: 180, end: 360 }, // night
    ];
  }, []);

  // regular vars =>
  const months = useMemo(() => {
    return ["winter", "spring", "summer", "autumn"];
  }, []);

  // vars with states =>
  const [showTime, setShowTime] = useState("");
  const [daytimeBackgroundColor, setDaytimeBackgroundColor] = useState(
    daytimeBackgrounds["morning"]
  );
  const [effectRotationDeg, setEffectRotationDeg] = useState(`${0}deg`);
  const [effectContainerClasses, setEffectContainerClasses] = useState("");

  // functions =>
  function setComponentSize(widthValue, widthParam) {
    document
      .querySelector(":root")
      .style.setProperty(
        "--clock-effect-container-diameter",
        `${widthValue}${widthParam}`
      );
  }

  // useEffect with functions inside the callback
  useEffect(() => {
    // functions =>
    function getCurrSeason(currMonth) {
      // return current season (from month - in decimal form)
      currMonth = currMonth % 12; // if month 12 -> set as 0 (winter is first & in december, which is 12)

      return months[Math.floor(currMonth / (months.length - 1))];
    }

    function mapDaytimeByCurrMonth() {
      const currMonth = new Date().getMonth(); // get current month
      const currSeason = getCurrSeason(currMonth); // get current season based on current month

      // set time settings by current season
      if (
        timeSettingSetter.hasOwnProperty(currSeason) &&
        typeof timeSettingSetter[currSeason] === "function"
      ) {
        return timeSettingSetter[currSeason]();
      }

      return null;
    }

    function initClock() {
      // set time settings
      const timeSettings = mapDaytimeByCurrMonth();

      // if null -> error accured -> stop clock init
      if (timeSettings === null) {
        console.log("Error: time settings are null");
        return;
      }

      // makes an array of time ranges for each time of the day
      const timeRanges = [
        {
          startSec: timeSettings.daytime.hourStart * 3600,
          endSec: timeSettings.daytime.morningHourEnd * 3600,
        }, // morning
        {
          startSec: timeSettings.daytime.morningHourEnd * 3600,
          endSec: timeSettings.daytime.noonHourEnd * 3600,
        }, // noon
        {
          startSec: timeSettings.daytime.noonHourEnd * 3600,
          endSec: timeSettings.daytime.afternoonHourEnd * 3600,
        }, // afternoon
        {
          startSec: timeSettings.daytime.afternoonHourEnd * 3600,
          endSec: timeSettings.daytime.eveningHourEnd * 3600,
        }, // evening
        {
          startSec: timeSettings.nightime.hourStart * 3600,
          endSec: timeSettings.nightime.hourEnd * 3600,
        }, // night
      ];

      // convert daytime backgrounds to array (to be able to use same offset for it and for sunMoonCycle array)
      const daytimeBackgroundsArr = Object.values(daytimeBackgrounds);

      // clock loop -> to constantly update the time
      setInterval(() => {
        // get current time
        const date = new Date();
        const hour = date.getHours(),
          minute = date.getMinutes(),
          second = date.getSeconds();

        let middayClockHour = hour % 12;
        middayClockHour = middayClockHour === 0 ? 12 : middayClockHour;

        const day = date.getDate(), // getDate() => current day in month. (getDay() => day in week)
          month = date.getMonth() + 1, // getMonth() => current month in year (between 0-11)
          year = date.getFullYear();
        const dateStr = `${(day < 10 ? "0" : "") + day}/${
          (month < 10 ? "0" : "") + month
        }/${year}`;
        const timeStr = `${
          (middayClockHour < 10 ? "0" : "") + middayClockHour
        }:${(minute < 10 ? "0" : "") + minute}`;
        const middayAbriv = hour > 12 ? "pm" : "am";

        setShowTime(dateStr + "\n" + timeStr + " " + middayAbriv); // set time display string

        // set daytime backgrounds & sun/moon position (sun & moon spin cycle)
        // get time of dayoffset
        const timeOfDayOffset = (timeSettings, hour) => {
          if (
            timeSettings.daytime.hourStart <= hour &&
            hour < timeSettings.daytime.morningHourEnd
          ) {
            return 0; // set time of day offset - morning
          }

          if (
            timeSettings.daytime.morningHourEnd <= hour &&
            hour < timeSettings.daytime.noonHourEnd
          ) {
            return 1; // set time of day offset - noon
          }

          if (
            timeSettings.daytime.noonHourEnd <= hour &&
            hour < timeSettings.daytime.afternoonHourEnd
          ) {
            return 2; // set time of day offset - afternoon
          }

          if (
            timeSettings.daytime.afternoonHourEnd <= hour &&
            hour < timeSettings.daytime.eveningHourEnd
          ) {
            return 3; // set time of day offset - evening
          }

          return 4; // set time of day offset - night
        };

        // function to map time to sun & moon cycle:
        const mapTimeToAngle = (
          timeInSeconds,
          startDegree,
          endDegree,
          timeRanges,
          daytimeOffset
        ) => {
          const nightOffset = 4, // to signify what daytime offset is night
            maxDayFullTimeSec = 24 * 3600; // the max amount of time in a day (in seconds)

          const normalizedTime = Math.max(
            0,
            Math.min(timeInSeconds, maxDayFullTimeSec)
          ); // to make sure to stay within 0-24 hours (in seconds)

          let totalTimeRange, mappedAngle;

          if (daytimeOffset !== nightOffset) {
            // daytime =>
            totalTimeRange = Math.abs(
              timeRanges[daytimeOffset].startSec -
                timeRanges[daytimeOffset].endSec
            ); // range calculation day

            // map time to angle
            mappedAngle =
              ((normalizedTime - timeRanges[daytimeOffset].startSec) /
                totalTimeRange) *
                (endDegree - startDegree) +
              startDegree;
          } else {
            // night time =>
            // set correct time range
            let timeRangeStart =
              timeRanges[daytimeOffset].startSec > normalizedTime
                ? 0
                : timeRanges[daytimeOffset].startSec;
            let timeRangeEnd =
              timeRanges[daytimeOffset].endSec < timeRangeStart
                ? maxDayFullTimeSec
                : timeRanges[daytimeOffset].endSec;

            totalTimeRange = Math.abs(timeRangeStart - timeRangeEnd); // range calculation day

            // set correct angle
            let midnightAngle = startDegree + (endDegree - startDegree) / 2;

            timeRangeStart < timeRanges[daytimeOffset].startSec
              ? (startDegree = midnightAngle)
              : (endDegree = midnightAngle);

            // map time to angle
            mappedAngle =
              ((normalizedTime - timeRangeStart) / totalTimeRange) *
                (endDegree - startDegree) +
              startDegree;
          }

          return mappedAngle; // just to make the new angle a non-floating number
        };

        const currTimeOfDayOffset = timeOfDayOffset(timeSettings, hour); // invoke current time of day offset out of function

        // set degree of sun & moon cycle
        const currTimeInSeconds = second + minute * 60 + hour * 60 * 60; // get current time in seconds
        const currSunMoonAngle = mapTimeToAngle(
          currTimeInSeconds,
          sunMoonCycleArr[currTimeOfDayOffset].start,
          sunMoonCycleArr[currTimeOfDayOffset].end,
          timeRanges,
          currTimeOfDayOffset
        ); // get current sun & moon angles
        setEffectRotationDeg(`${currSunMoonAngle}deg`); // set sun & moon angles

        // set daytime background color
        setDaytimeBackgroundColor(
          daytimeBackgroundsArr[
            currTimeOfDayOffset > daytimeBackgroundsArr.length - 1
              ? 0
              : currTimeOfDayOffset
          ] // must be offset out of possible daytime (night is not daytime => if overflow - set to morning)
        );

        // set nightime theme
        setEffectContainerClasses(
          `${
            hour < timeSettings.nightime.hourEnd ||
            hour >= timeSettings.nightime.hourStart
              ? styles.night
              : styles.day
          }`
        ); // nightime ends early
      }, 10);
    }

    // invoke clock init & clock loop
    initClock();
  }, [daytimeBackgrounds, months, sunMoonCycleArr, timeSettingSetter]);

  // final component to be rendered =>
  return (
    <div
      className={`${styles.clock} ${effectContainerClasses}`}
      style={
        effectContainerClasses === styles.day
          ? { background: daytimeBackgroundColor }
          : null
      } // if effectContainerClasses it's day time - set curr daytime background
    >
      {
        setComponentSize(
          widthValue,
          widthParam
        ) /* invoke size of component setter */
      }
      <div
        className={styles.container}
        style={{ transform: `rotateZ(${effectRotationDeg})` }}
      >
        <div className={styles.sun}></div>
        <div className={styles.moon}></div>
      </div>
      <p>{showTime ?? "system time could not be retrieved"}</p>
    </div>
  );
}
