import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FriendSearch.css";
import searchIcon from "../../assets/icon/search.png";

// 검색 대상 더미 데이터 
const dummyUsers = [
  { 
    id: "1", 
    userId: 1, 
    name: "나나", 
    tag: "1234", 
    bio: "안녕하세요! 저는 나나입니다.", 
    profileImageUrl: null 
},
  { 
    id: "2", 
    userId: 2, 
    name: "얀", 
    tag: "2342", 
    bio: "^^", 
    profileImageUrl: null 
    },
  { 
    id: "3", 
    userId: 3, 
    name: "지말", 
    tag: "1214", 
    bio: "ㅎㅎ", 
    profileImageUrl: null 
    },
  { 
    id: "4", 
    userId: 4, 
    name: "코다", 
    tag: "1223", 
    bio: ";ㅁ;", 
    profileImageUrl: null 
    },
  { 
    id: "5", 
    userId: 5,
    name: "딜런", 
    tag: "1777", 
    bio: ".", 
    profileImageUrl: null 
    },
];

// props: 부모에서 전달 / onFollow(팔로우 실행), followingList(이미 팔로우한 목록)
function FriendSearch({
  title = "팔로우 요청",
  placeholder = "이름/태그로 검색",
  onFollow,
  followingList = [],
}) {
  const navigate = useNavigate();

  // query: 입력창 값 => 바뀔 때마다 results 재계산 => 검색 결과 리렌더링
  const [query, setQuery] = useState("");

  // followingList가 바뀔 때만 재계산
  const followingIdSet = useMemo(() => {
    return new Set(followingList.map((x) => x.id));
  }, [followingList]);

  // query가 바뀔 때마다 dummyUsers를 filter → 이름·태그·"이름#태그" 중 하나라도 포함되면 결과에 포함
  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return []; // 입력 없으면 결과 없음
    return dummyUsers.filter((user) =>
      user.name.includes(q) ||
      user.tag.includes(q) ||
      `${user.name}#${user.tag}`.includes(q)
    );
  }, [query]);

  // 카드 클릭 → FriendDetailPage로 이동, user 데이터를 state로 전달
  const goFriendDetail = (friend) => {
    navigate("/friends/detail", { state: { friend } });
  };

  return (
    <section className="friend-search">
      <h2 className="friend-search__title">{title}</h2>

      <div className="friend-search__input-box">
        <span className="friend-search__icon" aria-hidden="true">
          <img src={searchIcon} alt="검색" className="friend-search__icon-img" />
        </span>

        {/* 입력 시 query state 업데이트 => results 재계산 => 목록 리렌더링 */}
        <input
          className="friend-search__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
      </div>

      {/* query 비어있으면 null / 결과 없으면 안내 문구 / 있으면 목록 렌더링 */}
      {query.trim() === "" ? null : results.length === 0 ? (
        <div className="friend-search__empty">검색 결과가 없습니다.</div>
      ) : (
        <ul className="friend-search__list">
          {results.map((user) => {
            // followingIdSet에 있으면 이미 팔로우 중 → 버튼 비활성화
            const isFollowing = followingIdSet.has(user.id);

            return (
              <li key={user.id} className="friend-search__item">
                {/* 카드 클릭 => goFriendDetail / 키보드 접근성(Enter, Space)도 지원 */}
                <div
                  className="friend-search__left"
                  role="button"
                  tabIndex={0}
                  onClick={() => goFriendDetail(user)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") goFriendDetail(user);
                  }}
                >
                  <div className="friend-avatar" aria-hidden="true">
                    {/* profileImageUrl 있으면 img, 없으면 SVG user icon */}
                    {user.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="" className="friend-avatar__img" />
                    ) : (
                      <UserIcon />
                    )}
                  </div>

                  <div className="friend-info">
                    <div className="friend-info__top">
                      <span className="friend-info__name">{user.name}</span>
                      <span className="friend-info__tag">#{user.tag}</span>
                    </div>
                    <div className="friend-info__bio">{user.bio || "한 줄 소개"}</div>
                  </div>
                </div>

                {/* isFollowing이면 버튼 비활성화 + "팔로잉" 표시
                    아니면 클릭 시 stopPropagation → onFollow(user) → 부모가 followingList 업데이트 */}
                <button
                  type="button"
                  className={`friend-follow-btn ${isFollowing ? "is-disabled" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFollow?.(user);
                  }}
                  disabled={isFollowing}
                >
                  {isFollowing ? "팔로잉" : "팔로우"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// 프로필 이미지 없을 때 표시되는 기본 아이콘
function UserIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z" fill="#ffffff" opacity="0.9" />
      <path d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default FriendSearch;