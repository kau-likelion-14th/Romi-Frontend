import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useState } from "react";
import "../../styles/Calendar.css";

// Date → "YYYY-MM-DD" 변환 
const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0-based라 +1
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// 날짜별 할 일 데이터 (YYYY-MM-DD)
const dummyTodosByDate = {
  "2026-05-04": [
    { id: 1, title: "프론트 보충자료 읽기", completed: true },
    { id: 2, title: "FriendCalendar 주석 달기", completed: false },
  ],
  "2026-05-06": [
    { id: 3, title: "친구 페이지 과제 제출", completed: true },
  ],
  "2026-05-10": [
    { id: 4, title: "React 복습하기", completed: false },
    { id: 5, title: "props 정리하기", completed: false },
    { id: 6, title: "useState 정리하기", completed: true },
  ],
};

export default function FriendCalendar() {
  // useState: 선택된 날짜를 기억 → 바뀌면 캘린더가 해당 날짜 선택 상태로 리렌더링
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 날짜 클릭 시 실행 → selectedDate 업데이트 (범위 선택 방어 처리 포함)
  const handleDateChange = (value) => {
    const next = value instanceof Date ? value : value?.[0];
    if (!next) return;
    setSelectedDate(next);
  };

  // 특정 날짜의 할 일 상태 계산 → tileContent·tileClassName에서 타일 표시 결정에 사용
  const getDayMeta = (date) => {
    const key = toDateKey(date);
    const list = dummyTodosByDate[key] ?? [];

    if (list.length === 0) return { hasTodos: false, remaining: 0, allDone: false };

    // filter로 미완료 항목 수 계산
    const remaining = list.filter((todo) => !todo.completed).length;

    return {
      hasTodos: true,
      remaining,
      allDone: remaining === 0,
    };
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handleDateChange} // 클릭 → selectedDate state 변경
        value={selectedDate}        // state값을 캘린더에 반영 (선택 날짜 표시)
        calendarType="gregory"
        view="month"
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={true}
        formatDay={(locale, date) => String(date.getDate())}

        // tileContent: 타일 안 콘텐츠 결정
        // getDayMeta 결과에 따라 → 할 일 없으면 null / 전부 완료면 "★" / 미완료면 남은 개수
        tileContent={({ date, view }) => {
          if (view !== "month") return null;
          const { hasTodos, remaining, allDone } = getDayMeta(date);
          if (!hasTodos) return null;
          return <div className="tile-meta">{allDone ? "★" : remaining}</div>;
        }}

        // tileClassName: 타일 배경색 클래스 결정
        // "tile-done"(전부 완료) / "tile-has"(미완료 있음)
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";
          const { hasTodos, allDone } = getDayMeta(date);
          if (!hasTodos) return "";
          return allDone ? "tile-done" : "tile-has";
        }}
      />
    </div>
  );
}