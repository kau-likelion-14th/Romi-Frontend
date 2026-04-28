import { useState, useRef } from "react";
import profileImg from "../../assets/image/profile.jpg"

function Profile() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [bio, setBio] = useState("");
  const [song, setSong] = useState("");
  const fileInputRef = useRef(null);

  const handleClickEditIcon = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const displayImageSrc = previewUrl || profileImg;

  const handleSave = () => {
    console.log("저장된 소개:", bio);
    console.log("저장된 노래:", song);
    alert("프로필이 저장되었습니다!");
  };

  return (
    <div className="profile-section">
      <div className="profile-top">
        <div className="profile-img-wrapper">
          <img
            src={displayImageSrc}
            alt="프로필"
            className="profile-img"
          />
          <button className="edit-icon" onClick={handleClickEditIcon}>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <h2 className="nickname"> Romi </h2>
        <button className="save-btn" onClick={handleSave}>
          프로필 저장
        </button>
      </div>

      <div className="profile-fields">
        <label>한 줄 소개</label>
        <input
          type="text"
          placeholder="안녕하세요"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="profile-input"
        />

        <label>좋아하는 노래</label>
        <div className="song-input-wrapper">
          <span>🎵</span>
          <input
            type="text"
            placeholder="Ode to Love - NCT Wish"
            value={song}
            onChange={(e) => setSong(e.target.value)}
            className="profile-input"
          />
          <span>🔍</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;