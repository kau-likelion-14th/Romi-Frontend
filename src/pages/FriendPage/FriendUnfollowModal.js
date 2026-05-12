import React, { useEffect } from "react";
import "../../styles/FriendUnfollowModal.css";

// props: isOpen(모달 표시 여부), friend(대상 친구), onConfirm(예 클릭), onClose(닫기)
function FriendUnfollowModal({ isOpen, friend, onConfirm, onClose }) {

  // isOpen이 true일 때만 Escape 키 이벤트 등록
  // → Escape 누르면 onClose 실행 → 부모가 isOpen을 false로 변경 → 모달 사라짐
  // cleanup(return)에서 이벤트 제거 → 모달 닫힌 후 불필요한 리스너 방지
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // isOpen false면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  const displayName = friend?.name ?? "";
  const displayTag = friend?.tag ? `#${friend.tag}` : "";

  // 오버레이(배경) 클릭 시 닫기 → 모달 박스 클릭은 제외 (e.target === e.currentTarget 체크)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="friend-unfollow-modal__overlay" onClick={handleOverlayClick}>
      <div className="friend-unfollow-modal__content" role="dialog" aria-modal="true">
        <p className="friend-unfollow-modal__text">
          <span className="friend-unfollow-modal__name">{displayName}</span>{" "}
          <span className="friend-unfollow-modal__tag">{displayTag}</span>
          님을 팔로우 목록에서
          <br />
          삭제하시겠습니까?
        </p>

        <div className="friend-unfollow-modal__actions">
          {/* 예: onConfirm 실행 → 부모가 friends 배열에서 해당 친구 제거 */}
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--yes"
            onClick={onConfirm}
          >
            예
          </button>

          {/* 아니오: onClose 실행 → 부모가 isOpen을 false로 변경 → 모달 사라짐 */}
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--no"
            onClick={onClose}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendUnfollowModal;