import React, {useState, useEffect} from "react";
import CustomCalendar from "./Calendar";
import { get, patch } from "../../Api";
import config from "../../Config";
import Todo from "./Todo";
import "../../styles/MainPage.css";

const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [todosByDate, setTodosByDate] = useState({});

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const dateKey = toDateKey(selectedDate);

    let active = true;

    const fetchTodos = async () => {
      try {
        const response = await get(config.TODOS.LIST, {
          date: dateKey,
        });

        if (response?.isSuccess === false) {
          throw new Error(response?.message || "Todo 조회 실패");
        }

        const list = Array.isArray(response?.result) ? response.result : [];

        const todos = list.map((todo) => ({
          id: todo.todoId,
          text: todo.description,
          category: todo.categoryName,
          completed: todo.completed,
        }));

        if (active) {
          setTodosByDate((prev) => ({ ...prev, [dateKey]: todos }));
        }
      } catch (error) {
        console.error("Todo 조회 실패:", error);
        if (active) {
          setTodosByDate((prev) => ({ ...prev, [dateKey]: [] }));
        }
      }
    };

    fetchTodos();

    return () => {
      active = false;
    };
  }, [selectedDate, refreshKey]);

  const [viewDate, setViewDate] = useState(new Date());
  const [remainingByDate, setRemainingByDate] = useState({});

  useEffect(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;

    let active = true;

    const fetchCalendar = async () => {
      try {
        const response = await get(config.CALENDAR.GET, {
          year,
          month,
        });

        if (response?.isSuccess === false) {
          throw new Error(response?.message || "캘린더 조회 실패");
        }

        const days = Array.isArray(response?.result?.days) ? response.result.days : [];
        const next = {};
        days.forEach((day) => {
          if (day.hasTodo) {
            next[day.date] = day.remaining;
          }
        });

        if (active) setRemainingByDate(next);
      } catch (error) {
        console.error("캘린더 조회 실패:", error);
        if (active) setRemainingByDate({});
      }
    };

    fetchCalendar();

    return () => {
      active = false;
    };
  }, [viewDate, refreshKey]);

  const handleToggle = async (todo) => {
    const dateKey = toDateKey(selectedDate);

    try {
      const response = await patch(
        config.TODOS.TOGGLE_COMPLETE(todo.id, dateKey),
        {
          completed: !todo.completed,
        }
      );

      if (response?.isSuccess === false) {
        throw new Error(response?.message || "완료 상태 변경 실패");
      }

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("완료 상태 변경 실패:", error);
    }
  };

  return (
    <div className="mainpage-container">
      <CustomCalendar
        initialDate={selectedDate}
        onDateChange={setSelectedDate}
        onMonthChange={(date) => date && setViewDate(date)}
        remainingByDate={remainingByDate}
      />
      <Todo
        selectedDate={selectedDate}
        todosByDate={todosByDate}
        setTodosByDate={setTodosByDate}
        onToggle={handleToggle}
        onChanged={() => setRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
};

export default MainPage;
