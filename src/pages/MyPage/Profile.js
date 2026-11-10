import React, { useRef, useState, useEffect } from "react";
import profileImg from "../../assets/image/profile.jpg";
import profileEditImg from "../../assets/image/profileedit.jpg";
import searchIcon from "../../assets/icon/search.png";
import { get } from "../../Api";
import config from "../../Config";

const Profile = () => {
  const fileInputRef = useRef(null);

  const [nickname, setNickname] = useState("Likelion#1253");
  const [intro, setIntro] = useState("안녕하세요");
  const [song, setSong] = useState("");

  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await get(config.PROFILE.GET);
      const result = response?.result;

      console.log("프로필 데이터:", result);

      if (!result) return;

      setNickname(result.username ?? "");
      setIntro(result.intro ?? "");
      setProfileImageUrl(result.profileImageUrl ?? null);

      const songResponse = await get(config.YOUTUBE.ME);

      if (
        songResponse?.isSuccess === false ||
        !Array.isArray(songResponse?.result)
      ) {
        throw new Error("유효하지 않은 노래 데이터 형식");
      }

      const songs = [...songResponse.result].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const latest = songs[0];

      // 하나의 템플릿 문자열로 합치기 (기존 코드는 문자열끼리 빼서 NaN)
      setSong(latest ? `${latest.title} - ${latest.artist}` : "");
    } catch (error) {
      console.error("프로필 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const handleClickEditIcon = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const displayImageSrc = previewUrl || profileImageUrl || profileImg;

  const handleSave = () => {
    console.log("저장될 프로필 데이터:", {
      intro,
      song,
      selectedImageFile,
    });

    alert("프로필이 임시로 저장됐어요! (API 연결 전)");
  };

  return (
    <div className="profile-section">
      {/* 상단: 프로필 사진 + 닉네임 + 저장 버튼 */}
      <div className="profile-top">
        <div className="profile-img-wrapper">
          <img
            src={displayImageSrc}
            alt="프로필 이미지"
            className="profile-img"
          />
          <button
            type="button"
            className="edit-icon"
            onClick={handleClickEditIcon}
            aria-label="프로필 사진 수정"
          >
            <img src={profileEditImg} alt="" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <div className="nickname">{nickname}</div>

        <button type="button" className="save-btn" onClick={handleSave}>
          프로필 저장
        </button>
      </div>

      {/* 하단: 한 줄 소개 / 좋아하는 노래 */}
      <div className="profile-fields">
        <label htmlFor="intro">한 줄 소개</label>
        <input
          id="intro"
          className="profile-input"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
        />

        <label htmlFor="song">좋아하는 노래</label>
        <div className="song-input-wrapper">
          <span>🎵</span>
          <input
            id="song"
            className="profile-input"
            value={song}
            onChange={(e) => setSong(e.target.value)}
          />
          <img src={searchIcon} alt="노래 검색" className="song-search-icon" />
        </div>
      </div>
    </div>
  );
};

export default Profile;