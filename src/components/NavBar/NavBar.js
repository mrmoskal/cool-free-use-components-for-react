import React, { useState } from "react";
import styles from "./NavBar.module.css";
import CoolClockNavbarVersion from "../CoolClockNavbarVersion/CoolClockNavbarVersion";
import { Link } from "react-router-dom";

export default function NavBar({ currPage = 0 }) {
  // vars =>
  const clockWidthSetting = getClockWidthValueAndPram();
  const links = [
    { link: "/#", text: "Page 1" },
    { link: "/#", text: "Page 2" },
    { link: "/#", text: "Page 3" },
    { link: "/#", text: "Page 4" },
  ]; // all links & names for all pages in your site

  // vars with usState() =>
  const [burgerActiveClass, setBurgerActiveClass] = useState("");
  const [navbarClosedClass, setNavbarClosedClass] = useState("");
  const [fullCowlingActiveClass, setFullCowlingActiveClass] = useState("");
  const [linkOffset, setLinkOffset] = useState(() => {
    if (currPage < 0 || currPage > links.length - 1) return 0;

    return currPage;
  });

  // functions =>
  function getClockWidthValueAndPram() {
    // return the width value of the clock in the navbar, as well as the parameter used with the value.
    const navbarWidthPropStr = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--component-height");

    const match = navbarWidthPropStr.match(/^(\d+)([a-zA-Z]+)$/); // check if first part is num and second is str. if true - seperates them accordingly.

    if (!match) {
      return null;
    }

    const widthValue = parseInt(match[1], 10); // get num part (as number)
    const widthParam = match[2]; // get str part

    return {
      clockWidthValue: widthValue * 2, // clock's height is half it's width
      clockWidthParam: widthParam,
    };
  }

  // final render =>
  return (
    <>
      <div className={`${styles.fullCowling} ${fullCowlingActiveClass}`}></div>
      <nav
        className={
          `${styles.container} 
        ${
          burgerActiveClass === ""
            ? `${navbarClosedClass}`
            : "" /* enable navbar closing */
        }
        ${
          burgerActiveClass !== "" ? `${styles.clicked}` : ""
        }` /* move navbar on click of burger */
        }
      >
        <div className={styles.content}>
          <CoolClockNavbarVersion
            className={styles.clock}
            widthValue={clockWidthSetting?.clockWidthValue}
            widthParam={clockWidthSetting?.clockWidthParam}
          />
          <button
            className={`${styles.burger} ${burgerActiveClass}`}
            onClick={() => {
              setBurgerActiveClass(
                burgerActiveClass === "" ? `${styles.clicked}` : ""
              );
              setFullCowlingActiveClass(
                fullCowlingActiveClass === ""
                  ? `${styles.oneHundredPresent}`
                  : ""
              );
            }}
          >
            <span>☰</span>
          </button>
          <button
            className={styles.toggleBtn}
            onClick={() => {
              setNavbarClosedClass(
                burgerActiveClass === ""
                  ? navbarClosedClass === ""
                    ? `${styles.closed}`
                    : ""
                  : ""
              );
            }}
          >
            {navbarClosedClass === "" ? "▲" : "▼"}
          </button>
        </div>
        <div className={styles.dropdown}>
          <ul className={styles.links}>
            <li className={styles.prev2}>
              <Link
                to={
                  links[
                    (linkOffset - 2) % links.length < 0
                      ? links.length + ((linkOffset - 2) % links.length)
                      : linkOffset - 2
                  ].link
                }
              >
                {
                  links[
                    (linkOffset - 2) % links.length < 0
                      ? links.length + ((linkOffset - 2) % links.length)
                      : linkOffset - 2
                  ].text
                }
              </Link>
            </li>
            <li className={styles.prev}>
              <Link
                to={
                  links[
                    (linkOffset - 1) % links.length < 0
                      ? links.length - 1
                      : linkOffset - 1
                  ].link
                }
              >
                {
                  links[
                    (linkOffset - 1) % links.length < 0
                      ? links.length - 1
                      : linkOffset - 1
                  ].text
                }
              </Link>
            </li>
            <li className={styles.current}>
              <Link to={links[linkOffset].link}>{links[linkOffset].text}</Link>
            </li>
            <li className={styles.next}>
              <Link to={links[Math.abs((linkOffset + 1) % links.length)].link}>
                {links[Math.abs((linkOffset + 1) % links.length)].text}
              </Link>
            </li>
            <li className={styles.next2}>
              <Link to={links[Math.abs((linkOffset + 2) % links.length)].link}>
                {links[Math.abs((linkOffset + 2) % links.length)].text}
              </Link>
            </li>
          </ul>
          <button
            className={`${styles.linkBtn} ${styles.next}`}
            onClick={() => {
              setLinkOffset(Math.abs((linkOffset + 1) % links.length));
            }}
          >
            ►
          </button>
          <button
            className={`${styles.linkBtn} ${styles.prev}`}
            onClick={() => {
              setLinkOffset(
                (linkOffset - 1) % links.length < 0
                  ? links.length - 1
                  : linkOffset - 1
              );
            }}
          >
            ◄
          </button>
          <p>
            {`page: ${linkOffset + 1}`}/{links.length}
          </p>
        </div>
      </nav>
    </>
  );
}
