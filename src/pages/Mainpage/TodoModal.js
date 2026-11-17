import React, {useEffect, useState} from "react";
import "../../styles/Todo.css";
import "../../styles/TodoModal.css";
import RoutineModal from "./RoutineModal";

const Days = ["월", "화", "수", "목", "금", "토", "일"];

const TodoModal = ({
    isOpen,
    onClose,
    onSave,
    onDelete,
    initialTodo,
    categories = {},
    isSubmitting = false,
}) => {
    const isEditMode = Boolean(initialTodo);

    const [category, setCategory] = useState("");
    const [text, setText] = useState("");
    const [routine, setRoutine] = useState(null);
    const [error, setError] = useState("");

    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        setCategory(initialTodo?.category || "");
        setText(initialTodo?.text || "");
        setRoutine(initialTodo?.routine || null);
        setError("");
        setIsRoutineModalOpen(false);
    }, [isOpen, initialTodo]);

    useEffect(() => {
        if (!isOpen) return;
        setCategory((prev) => prev || Object.keys(categories)[0] || "");
    }, [isOpen, categories]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!text.trim() || !category || isSubmitting) return;
        setError("");
        try {
            await onSave({
                text: text.trim(),
                category,
                routine,
            });
        } catch (e) {
            setError(e.message);
        }
    };

    const handleDelete = async () => {
        if (isSubmitting) return;
        setError("");
        try {
            await onDelete();
        } catch (e) {
            setError(e.message);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) onClose();
    };

    const categoryKeys = Object.keys(categories);

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-title">
                    {isEditMode ? "할 일 수정하기" : "할 일 추가하기"}
                </div>
                <div className="modal-section">
                    <div className="modal-label">카테고리</div>
                    <div className="modal-categories">
                        {categoryKeys.length === 0 && <div>카테고리가 없습니다</div>}
                        {categoryKeys.map((c) => (
                            <label
                                key={c}
                                className={`modal-categoryitem ${category === c ? 'selected' : ''}`}
                            >
                                <span style={categories[c]}>{c}</span>
                                <input
                                    type="radio"
                                    name="category"
                                    value={c}
                                    checked={category === c}
                                    onChange={() => setCategory(c)}
                                />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="modal-section">
                    <div className="modal-label">내용</div>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="text-input"
                            placeholder="내용을 입력해주세요"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                </div>
                <div className="modal-section">
                    <button
                        type="button"
                        className="routine-row"
                        disabled={isSubmitting}
                        onClick={() => setIsRoutineModalOpen(true)}
                    >
                        <div className="routine-label">{routine ? "루틴 수정하기" : "루틴 등록하기"}</div>
                        <div className="routine-button">{"›"}</div>
                    </button>
                    {routine && (
                        <div className="routine-summary">
                            <span>매주 {Days[routine.repeatDays]} · {routine.startDate} ~ {routine.endDate}</span>
                            {!isEditMode && (
                                <button
                                    type="button"
                                    className="routine-reset"
                                    disabled={isSubmitting}
                                    onClick={() => setRoutine(null)}
                                >
                                    루틴 해제
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {error && <p className="modal-error">{error}</p>}
                <div className="modal-actions">
                    <button
                        className={`leftbutton ${isEditMode ? '' : 'disabled'}`}
                        onClick={handleDelete}
                        disabled={!isEditMode || isSubmitting}
                    >
                        삭제
                    </button>
                    <button
                        className={`rightbutton ${text.trim() && category ? '' : 'disabled'}`}
                        onClick={handleSave}
                        disabled={!text.trim() || !category || isSubmitting}
                    >
                        {isSubmitting ? "저장 중..." : "저장"}
                    </button>
                </div>
                <RoutineModal
                    isOpen={isRoutineModalOpen}
                    initialRoutine={routine}
                    onClose={() => setIsRoutineModalOpen(false)}
                    onSave={(newRoutine) => {
                        setRoutine(newRoutine);
                        setIsRoutineModalOpen(false);
                    }}
                />
            </div>
        </div>
    );
};

export default TodoModal;
