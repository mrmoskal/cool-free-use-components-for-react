import React from "react";
import styles from "./Card.module.css";

export default function Card({ background, title, profile }) {
  const alternatives = {
    profile_alt: "profile not found",
    background_alt: "card image not found",
    title_img_alt: "title-card not found",
  };

  return (
    <div className={styles.container}>
      <div className={styles.card_bg}>
        <img
          className={styles.card_bg_img}
          src={background}
          alt={alternatives.background_alt}
        />
      </div>
      <img
        className={styles.card_title_img}
        src={title}
        alt={alternatives.title_img_alt}
      />
      <img
        className={styles.card_profile_img}
        src={profile}
        alt={alternatives.profile_alt}
      />
    </div>
  );
}
