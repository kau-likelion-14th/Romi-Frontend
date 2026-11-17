import React, { useEffect, useState } from "react";
import "../../styles/Todo.css";

const Days = ["월", "화", "수", "목", "금", "토", "일"];

const RoutineModal = ({
    isOpen,
    onClose,
    onSave,
    initialRoutine,
}) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [repeatDays, setRepeatDays] = useState(null);
    const [error, setError] = useState("");
    const title = initialRoutine ? "루틴 수정하기" : "루틴 등록하기";

    useEffect(() => {
        if (!isOpen) return;

        setStartDate(initialRoutine?.startDate || "");
        setEndDate(initialRoutine?.endDate || "");
        setRepeatDays(initialRoutine?.repeatDays ?? null);
        setError("");
    }, [isOpen, initialRoutine]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!startDate || !endDate || !Number.isInteger(repeatDays)) {
            setError("시작 날짜, 종료 날짜, 반복 요일을 모두 선택해주세요.");
            return;
        }
        if (startDate > endDate) {
            setError("종료 날짜는 시작 날짜보다 빠를 수 없습니다.");
            return;
        }
        setError("");
        onSave({
            startDate,
            endDate,
            repeatDays,
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="routine-header">
                    <div className="routine-close" onClick={onClose}>{"‹"}</div>
                    <div className="routine-title">{title}</div>
                </div>

                <div className="modal-section">
                    <div className="modal-label">시작 날짜</div>
                    <div className="date-wrapper">
                        <input
                            type="date"
                            className="date-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <div className="date-initial">{startDate || "없음"}</div>
                    </div>
                </div>

                <div className="modal-section">
                    <div className="modal-label">종료 날짜</div>
                    <div className="date-wrapper">
                        <input
                            type="date"
                            className="date-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <div className="date-initial">{endDate || "없음"}</div>
                    </div>
                </div>

                <div className="modal-section">
                    <div className="modal-label">반복</div>
                    <div className="modal-categories">
                        {Days.map((day, idx) => (
                            <label
                                key={day}
                                className={`modal-categoryitem ${repeatDays === idx ? "on" : ""}`}
                            >
                                <span>{day}</span>
                                <input
                                    type="checkbox"
                                    name="checkbox"
                                    value={idx}
                                    checked={repeatDays === idx}
                                    onChange={() => setRepeatDays(idx)}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {error && <p className="modal-error">{error}</p>}

                <div className="modal-actions">
                    <button className="leftbutton2" onClick={onClose}>취소</button>
                    <button className="rightbutton" onClick={handleSave}>저장</button>
                </div>
            </div>
        </div>
    );
};

export default RoutineModal;