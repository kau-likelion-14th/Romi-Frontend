import React from "react";
import Profile from "./Profile.js";
import Status from "./Status.js";
import "../../styles/MyPage.css";

const MyPage = () => {
  return (
    <main className="mypage-container">
      <Profile />
      <Status />
    </main>
  );
}

export default MyPage;