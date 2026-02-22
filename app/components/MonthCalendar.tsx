"use client";

import { useEffect, useState } from "react";

export default function MonthCalendar() {
  const [calendarDays, setCalendarDays] = useState<React.ReactElement[]>([]);
  const [monthName, setMonthName] = useState("");
  const [year, setYear] = useState("");
  const [fullDate, setFullDate] = useState("");

  useEffect(() => {
    generateCalendar();
  }, []);

  function generateCalendar() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    setMonthName(monthNames[month]);
    setYear(currentYear.toString());
    setFullDate(`Aujourd'hui, ${today} ${monthNames[month]}`);

    const days: React.ReactElement[] = [];

    let firstDay = new Date(currentYear, month, 1).getDay();
    let offset = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();

    for (let i = 0; i < offset; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today;
      days.push(
        <div
          key={`day-${day}`}
          className={`relative flex items-center justify-center text-base font-medium py-2 transition-all overflow-visible ${
            isToday
              ? "font-bold text-[#262626]"
              : "text-[#262626]/60"
          }`}
        >
          <span className={isToday ? "relative z-10" : undefined}>{day}</span>
          {isToday && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                className="calendar-heart-svg w-12 h-12 flex-shrink-0"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M50 85C50 85 10 65 10 35C10 18 25 10 40 20C45 23 50 30 50 30C50 30 55 23 60 20C75 10 90 18 90 35C90 65 50 85 50 85"
                  stroke="#262626"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="rotate(-15, 50, 50) scale(1.1)"
                  strokeDasharray="350"
                  strokeDashoffset="350"
                />
              </svg>
            </div>
          )}
        </div>
      );
    }

    setCalendarDays(days);
  }

  return (
    <div className="fv-card w-full max-w-sm mx-auto p-8 overflow-visible">
      <header className="text-center mb-8">
        <h1 className="font-display text-5xl sm:text-6xl text-[#262626] leading-tight">{monthName}</h1>
        <p className="text-sm tracking-widest font-semibold text-[#262626]/50 mt-[-8px]">{year}</p>
      </header>

      <div className="grid grid-cols-7 gap-y-4 text-center overflow-visible">
        <div className="text-xs font-black uppercase tracking-widest text-[#262626]">L</div>
        <div className="text-xs font-black uppercase tracking-widest text-[#262626]">M</div>
        <div className="text-xs font-black uppercase tracking-widest text-[#262626]">M</div>
        <div className="text-xs font-black uppercase tracking-widest text-[#262626]">J</div>
        <div className="text-xs font-black uppercase tracking-widest text-[#262626]">V</div>
        <div className="text-xs font-black uppercase tracking-widest text-[#262626]">S</div>
        <div className="text-xs font-black uppercase tracking-widest text-[#262626]">D</div>

        {calendarDays}
      </div>

      <div className="mt-10 pt-6 border-t border-[#E5E3DD] flex justify-between items-center text-xs font-medium text-[#262626]/50">
        <span>{fullDate}</span>
        <span className="uppercase tracking-widest">Calendrier</span>
      </div>
    </div>
  );
}
