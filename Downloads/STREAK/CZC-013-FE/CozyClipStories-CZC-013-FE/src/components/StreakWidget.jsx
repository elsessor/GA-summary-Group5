import React, { useEffect, useRef, useState } from "react";
import { Flame, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllStreaks, getMonthStreaks, setActiveForDate } from "../services/streakApi";

// A floating draggable streak widget. Clicking toggles a small calendar.
// Active days show a flame; inactive days are gray. Position and activity persist in localStorage.
const StreakWidget = () => {
  const [pos, setPos] = useState({ x: 20, y: 80 });
  const [dragging, setDragging] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeDays, setActiveDays] = useState({});
  const startRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const didDragRef = useRef(false);

  const widgetSize = 52;
  const storageKeyPos = "streakWidgetPosition";
  const storageKeyDays = "streakActiveDays";

  const getDateKey = (d = new Date()) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  useEffect(() => {
    try {
      const savedPos = localStorage.getItem(storageKeyPos);
      if (savedPos) {
        const parsed = JSON.parse(savedPos);
        if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
          setPos(parsed);
        }
      }
      getAllStreaks().then((all) => setActiveDays(all));
    } catch {}
  }, []);

  useEffect(() => {
    const key = getDateKey();
    setActiveDays((prev) => {
      if (prev[key]) return prev;
      setActiveForDate(key, true).then((next) => setActiveDays(next));
      return prev;
    });
  }, []);

  // Drag handlers
  const onPointerDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    startRef.current = { x: startX, y: startY, px: pos.x, py: pos.y };
    didDragRef.current = false;
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) didDragRef.current = true;
      const nx = startRef.current.px + dx;
      const ny = startRef.current.py + dy;
      const maxX = window.innerWidth - widgetSize - 8;
      const maxY = window.innerHeight - widgetSize - 8;
      setPos({ x: Math.max(8, Math.min(nx, maxX)), y: Math.max(8, Math.min(ny, maxY)) });
    };
    const onUp = () => {
      setDragging(false);
      try { localStorage.setItem(storageKeyPos, JSON.stringify(pos)); } catch {}
      // If it was a simple click (no drag), toggle calendar
      if (!didDragRef.current) setCalendarOpen((o) => !o);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  useEffect(() => {
    getMonthStreaks(viewYear, viewMonth).then((m) => {
      setActiveDays((prev) => ({ ...prev, ...m }));
    });
  }, [viewYear, viewMonth]);

  const year = viewYear;
  const month = viewMonth;
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay(); // 0..6 (Sun..Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isActiveDay = (dnum) => {
    const key = getDateKey(new Date(year, month, dnum));
    return !!activeDays[key];
  };

  const goPrevMonth = () => {
    const d = new Date(year, month, 1);
    d.setMonth(d.getMonth() - 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const goNextMonth = () => {
    const d = new Date(year, month, 1);
    d.setMonth(d.getMonth() + 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const goToday = () => {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  };

  return (
    <>
      {/* Floating button */}
      <div
        role="button"
        aria-label="Streak widget"
        onPointerDown={onPointerDown}
        className={`fixed z-[60] cursor-grab active:cursor-grabbing select-none shadow-md rounded-full flex items-center justify-center bg-white border border-gray-200 ${dragging ? "ring-2 ring-[#b0042b]/40" : ""}`}
        style={{ left: pos.x, top: pos.y, width: widgetSize, height: widgetSize }}
      >
        <Flame size={24} className="text-orange-500" />
      </div>

      {/* Calendar popover */}
      {calendarOpen && (
        <div
          className="fixed z-[59] bg-white border border-gray-200 shadow-xl rounded-md p-4 w-80"
          style={{ left: Math.min(pos.x, window.innerWidth - 340), top: Math.min(pos.y + widgetSize + 8, window.innerHeight - 320) }}
        >
          <div className="flex items-center justify-between mb-3">
            <button className="p-1 rounded hover:bg-gray-100" onClick={goPrevMonth} aria-label="Previous month">
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-orange-500" />
              <span className="text-sm font-semibold">Streak Calendar</span>
            </div>
            <button className="p-1 rounded hover:bg-gray-100" onClick={goNextMonth} aria-label="Next month">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>
              {new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" })}
            </span>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded border text-[11px] hover:bg-gray-50" onClick={goToday}>Today</button>
              <button className="p-1 rounded hover:bg-gray-100" aria-label="Close calendar" onClick={() => setCalendarOpen(false)}>
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {dayNames.map((n) => (
              <div key={n} className="text-[11px] font-medium text-gray-500">
                {n}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, idx) => {
              if (d === null) return <div key={`e-${idx}`} className="h-8" />;
              const active = isActiveDay(d);
              const today = d === now.getDate() && year === now.getFullYear() && month === now.getMonth();
              return (
                <div
                  key={`d-${d}`}
                  className={`h-10 rounded flex items-center justify-center border text-[12px] ${today ? "border-[#b0042b]" : "border-gray-200"}`}
                >
                  <div className="flex items-center gap-1">
                    <span className="leading-none">{d}</span>
                    {active ? (
                      <Flame size={14} className="text-orange-500" />
                    ) : (
                      <div className="w-[10px] h-[10px] rounded-full bg-gray-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-[11px] text-gray-500">
            Active days light a flame; inactive days are gray.
          </div>
        </div>
      )}
    </>
  );
};

export default StreakWidget;