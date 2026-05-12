import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/icon/delete.png";
import "../../styles/FriendList.css";

// props: 부모 컴포넌트에서 전달 / 기본값은 빈 상태로 설정
function FriendList({
  title = "팔로우 목록",
  friends = [],        // 친구 목록 배열 
  onClickRemove,       // 삭제 버튼 클릭 시 실행할 함수
  emptyText = "팔로우하는 친구가 없습니다.",
}) {
  const navigate = useNavigate();

  // 친구 카드 클릭 → FriendDetailPage로 이동, friend 데이터를 state로 전달
  const goFriendDetail = (friend) => {
    navigate(`/friends/${friend.id}`, { state: { friend } });
  };

  return (
    <section className="friend-list">
      <h2 className="friend-list__title">{title}</h2>

      {/* friends 배열이 비어있으면 안내 문구, 있으면 목록 렌더링 */}
      {friends.length === 0 ? (
        <div className="friend-list__empty">{emptyText}</div>
      ) : (
        <ul className="friend-list__items">
          {/* friends 배열을 순회 → 각 friend 객체로 카드 1개씩 생성 */}
          {friends.map((friend) => (
            <li key={friend.id} className="friend-list__item">

              {/* 카드 왼쪽 영역 클릭 → goFriendDetail 실행 → FriendDetailPage로 이동 */}
              <div
                className="friend-list__left"
                role="button"
                tabIndex={0}
                onClick={() => goFriendDetail(friend)}
              >
                <div className="friend-avatar" aria-hidden="true">
                  {/* profileImageUrl 있으면 img, 없으면 user icon */}
                  {friend.profileImageUrl ? (
                    <img className="friend-avatar__img" src={friend.profileImageUrl} alt="프로필 사진" />
                  ) : (
                    <UserIcon />
                  )}
                </div>

                <div className="friend-info">
                  <div className="friend-info__top">
                    <span className="friend-info__name">{friend.name}</span>
                    <span className="friend-info__tag">#{friend.tag}</span>
                  </div>
                  {/* bio 없으면 대체 문구 표시 */}
                  {friend.bio ? (
                    <div className="friend-info__bio">{friend.bio}</div>
                  ) : (
                    <div className="friend-info__empty">소개글이 없습니다.</div>
                  )}
                </div>
              </div>

              {/* e.stopPropagation(): 카드 클릭 이벤트 버블링 차단 → 페이지 이동 방지
                  onClickRemove에 friend를 넘겨 부모가 해당 항목을 friends 배열에서 제거 */}
              <button
                className="friend-remove-btn"
                type="button"
                aria-label="삭제"
                onClick={(e) => {
                  e.stopPropagation();
                  onClickRemove?.(friend);
                }}
              >
                <img className="friend-remove-icon" src={deleteIcon} alt="삭제 아이콘" />
              </button>
            </li>
          ))}
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

export default FriendList;