import Profile from "./Profile.js";
import Status from "./Status.js";
import "../../styles/MyPage.css";

function MyPage() {
  return (
    <div className="mypage-container">
      <Profile />
      <Status />
    </div>
  );
}

export default MyPage;