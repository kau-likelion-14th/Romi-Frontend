import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FriendCalendar from "./FriendCalendar";
import FriendTodo from "./FriendTodo";

import "../../styles/FriendDetailPage.css";

// 카테고리별 배지 색상 → FriendTodo에 props로 전달되어 할 일 항목 스타일에 사용
const Categories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  일상: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

// Date → "YYYY-MM-DD" 변환 
const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// 더미 데이터: 실제 API 대신 임시로 쓰는 가짜 데이터
const dummyFriend = {
  followId: "1",
  name: "나나",
  tag: "1234",
  bio: "안녕하세요! 저는 나나입니다.",
  profileImage: null,
};

const dummySavedSongs = [
  { id: 1, title: "Ditto", artist: "NewJeans", imageUrl: null },
];

const dummyTodosByDate = {
  "2026-05-04": [
    { id: 1, text: "프론트 보충자료 읽기", category: "공부", completed: true },
    { id: 2, text: "FriendDetailPage 주석 달기", category: "공부", completed: false },
  ],
  "2026-05-06": [
    { id: 3, text: "친구 페이지 과제 제출", category: "동아리", completed: true },
  ],
  "2026-05-10": [
    { id: 4, text: "React 복습하기", category: "공부", completed: false },
    { id: 5, text: "동아리 회의", category: "동아리", completed: false },
    { id: 6, text: "산책하기", category: "일상", completed: true },
  ],
};

const dummyRemainingByDate = {
  "2026-05-04": { hasTodo: true, remaining: 1 },
  "2026-05-06": { hasTodo: true, remaining: 0 },
  "2026-05-10": { hasTodo: true, remaining: 2 },
};

function FriendDetailPage() {
  const navigate = useNavigate();
  const location = useLocation(); // 이전 페이지에서 navigate(path, { state: { friend } })로 넘긴 데이터 수신

  // 이전 페이지에서 friend 데이터를 넘겼으면 사용, 없으면 더미로 폴백
  const passedFriend = location.state?.friend ?? null;

  const [friend] = useState(passedFriend ?? dummyFriend);
  const [savedSongs] = useState(dummySavedSongs);

  // selectedDate: 캘린더에서 클릭한 날짜 
  // viewDate: 현재 보고 있는 월 
  const [selectedDate, setSelectedDate] = useState(new Date("2026-05-04"));
  const [viewDate, setViewDate] = useState(new Date("2026-05-04"));

  const [todosByDate] = useState(dummyTodosByDate);
  const [remainingByDate] = useState(dummyRemainingByDate);

  // savedSongs 배열의 첫 번째 곡만 표시 / savedSongs가 바뀔 때만 재계산
  const latestSong = useMemo(() => {
    if (!Array.isArray(savedSongs) || savedSongs.length === 0) return null;
    return savedSongs[0];
  }, [savedSongs]);

  // selectedDate가 바뀔 때마다 해당 날짜 키로 할 일 목록 재계산 → FriendTodo에 props로 전달
  const todos = useMemo(() => {
    const key = toDateKey(selectedDate);
    return todosByDate[key] ?? [];
  }, [selectedDate, todosByDate]);

  return (
    <div className="friend-detail-page">
      <div className="friend-detail-page__inner">
        <div className="friend-detail-page__top">
{/*클릭 시 navigate(-1)로 브라우저 히스토리 한 단계 뒤로 이동*/}
          <button
            type="button"
            className="friend-detail-page__back"
            aria-label="뒤로가기"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>

          <div className="friend-detail-page__profile">
            <div className="friend-detail-page__avatar" aria-hidden="true">
              {/* profileImage 있으면 img 태그 */}
              {friend?.profileImage ? (
                <img src={friend.profileImage} alt="profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <UserIcon />
              )}
            </div>

            <div className="friend-detail-page__profile-info">
              <div className="friend-detail-page__name-line">
                <span className="friend-detail-page__name">
                  {friend?.name || " "}
                </span>
              </div>
              <div className="friend-detail-page__bio">
                {friend?.bio || "한 줄 소개"}
              </div>
            </div>
          </div>

          <div className="friend-detail-page__songs-inline">
            {/* latestSong이 null이면 "저장한 곡이 없습니다" 표시 */}
            {latestSong ? (
              <div className="friend-detail-page__song-inline-item">
                <div className="friend-detail-page__song-inline-cover">
                  {latestSong?.imageUrl ? (
                    <img src={latestSong.imageUrl} alt={latestSong.title || "album"} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
                  ) : null}
                </div>
                <div className="friend-detail-page__song-inline-info">
                  <div className="friend-detail-page__song-inline-title">
                    {latestSong?.title || "제목 없음"}
                  </div>
                  <div className="friend-detail-page__song-inline-artist">
                    {latestSong?.artist || "아티스트 정보 없음"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="friend-detail-page__songs-inline-empty">
                저장한 곡이 없습니다.
              </div>
            )}
          </div>
        </div>

        <div className="friend-detail-page__grid">
          <div className="friend-detail-page__calendar">
            {/* FriendCalendar에 날짜 데이터를 props로 전달
                날짜 클릭 → onDateChange → selectedDate 변경 → todos 재계산
                월 이동 → onMonthChange → viewDate 변경 */}
            <FriendCalendar
              initialDate={selectedDate}
              onDateChange={(date) => date && setSelectedDate(date)}
              onMonthChange={(date) => {
                if (!date) return;
                setViewDate(date);
              }}
              todosByDate={todosByDate}
              remainingByDate={remainingByDate}
            />
          </div>

          <div className="friend-detail-page__todo">
            {/* todos: selectedDate 기준으로 계산된 할 일 목록
                categories: 배지 색상 스타일 객체 → FriendTodo 내부에서 category 값으로 스타일 조회 */}
            <FriendTodo
              title="To do List"
              todos={todos}
              categories={Categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 프로필 이미지가 없을 때 표시되는 기본 아이콘
function UserIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z" fill="#ffffff" opacity="0.9" />
      <path d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default FriendDetailPage;