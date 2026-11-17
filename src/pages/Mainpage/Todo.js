import React, {useEffect, useMemo, useState} from "react";
import "../../styles/Todo.css";
import TodoModal from "./TodoModal";
import { get, post, put, del } from "../../Api";
import config from "../../Config";

const Weeks = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const toTodoDetail = (todo) => ({
    id: todo.todoId,
    text: todo.description,
    category: todo.categoryName,
    routine: todo.routineEnabled
        ? {
            startDate: todo.startDate,
            endDate: todo.endDate,
            repeatDays: Weeks.indexOf(todo.week),
        }
        : null,
});

const toTodoRequest = ({ text, category, routine }) => {
    const hasRoutine =
        Boolean(routine?.startDate) &&
        Boolean(routine?.endDate) &&
        Number.isInteger(routine?.repeatDays) &&
        routine.repeatDays >= 0;

    return {
        categoryName: category,
        description: text,
        routineEnabled: hasRoutine,
        ...(hasRoutine && {
            startDate: routine.startDate,
            endDate: routine.endDate,
            week: Weeks[routine.repeatDays],
        }),
    };
};

const Categories = {
    공부: { backgroundColor: '#E5F8F1', color: '#333' },
    운동: { backgroundColor: '#FFC8BE', color: '#333' },
    동아리: { backgroundColor: '#B6DAFF', color: '#333' },
};

const DEFAULT_CATEGORY_STYLE = { backgroundColor: '#EEEEEE', color: '#333' };
const getCategoryStyle = (name) => Categories[name] ?? DEFAULT_CATEGORY_STYLE;

    const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const Todo = ({ selectedDate, todosByDate, onToggle, onChanged }) => {
    const dateKey = toDateKey(selectedDate);

    const todos = todosByDate[dateKey] ?? [];

    const [serverCategories, setServerCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setIsModalOpen(false);
        setEditingTodo(null);
        setError("");
    }, [dateKey]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await get(config.CATEGORIES.GET);
                const list = Array.isArray(response?.result) ? response.result : [];
                setServerCategories(list);
            } catch (error) {
                console.error("카테고리 조회 실패:", error);
            }
        };

        fetchCategories();
    }, []);

    const modalCategories = useMemo(() => {
        if (serverCategories.length === 0) return Categories;
        const result = {};
        serverCategories.forEach((c) => {
            const name = c.name ?? c.categoryName;
            if (name) result[name] = getCategoryStyle(name);
        });
        return result;
    }, [serverCategories]);

    const openModal = () => {
        setError("");
        setEditingTodo(null);
        setIsModalOpen(true);
    };

    const openEditModal = async (todo) => {
        setError("");
        try {
            const response = await get(config.TODOS.DETAIL(todo.id));

            if (response?.isSuccess === false || !response?.result) {
                throw new Error(response?.message || "Todo 상세 조회 실패");
            }

            setEditingTodo({ ...toTodoDetail(response.result), completed: todo.completed });
            setIsModalOpen(true);
        } catch (error) {
            console.error("Todo 상세 조회 실패:", error);
            setError("할 일 정보를 불러오지 못했습니다. 다시 시도해주세요.");
        }
    };

    const TodoCompleted = (todo) => {
        onToggle?.(todo);
    };

    const handledSaveTodo = async ({text, category, routine}) => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const body = toTodoRequest({ text, category, routine });
            const response = editingTodo
                ? await put(config.TODOS.DETAIL(editingTodo.id), body)
                : await post(config.TODOS.LIST, body, { params: { date: dateKey } });

            if (response?.isSuccess === false) {
                throw new Error(response?.message || "Todo 저장 실패");
            }

            setIsModalOpen(false);
            onChanged?.();
        } catch (error) {
            console.error("Todo 저장 실패:", error);
            throw new Error(error?.response?.data?.message || "저장하지 못했습니다. 다시 시도해주세요.");
        } finally {
            setSubmitting(false);
        }
    };

    const handledDeleteTodo = async () => {
        if (!editingTodo || submitting) return;
        setSubmitting(true);
        try {
            const response = await del(config.TODOS.DELETE(editingTodo.id, dateKey));

            if (response?.isSuccess === false) {
                throw new Error(response?.message || "Todo 삭제 실패");
            }

            setIsModalOpen(false);
            onChanged?.();
        } catch (error) {
            console.error("Todo 삭제 실패:", error);
            throw new Error(error?.response?.data?.message || "삭제하지 못했습니다. 다시 시도해주세요.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="todo-container">
            <div className="todo-header">
                <div className="todo-title">To do List</div>
                <button className="todo-add" onClick={openModal}>+</button>
            </div>
            {error && <p className="todo-message todo-error">{error}</p>}
            {!error && todos.length === 0 && <p className="todo-message">등록된 할 일이 없습니다.</p>}
            <div className="todo-list">
                {todos.map((t) => (
                    <div 
                        key={t.id} 
                        className={`todo-item ${t.completed ? 'done' : ''}`}
                        onClick={() => openEditModal(t)}
                    >
                        <button 
                            className={`checkbox ${t.completed ? 'checked' : ''}`} 
                            onClick={(e) => {
                                e.stopPropagation();
                                TodoCompleted(t);
                            }}
                        >
                        </button>
                        <div className="todo-text">{t.text}</div>
                        <div 
                            className="todo-category"
                            style={getCategoryStyle(t.category)}
                        >
                            {t.category}
                        </div>
                    </div>
                ))}
            </div>
            <TodoModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handledSaveTodo}
                onDelete={handledDeleteTodo}
                initialTodo={editingTodo}
                categories={modalCategories}
                isSubmitting={submitting}
            />
        </div>
    );
};

export default Todo;