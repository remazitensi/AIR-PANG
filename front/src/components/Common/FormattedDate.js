import React from "react";

export default function FormattedDate({ date }) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const day = days[date.getDay()];

  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const minutes = date.getMinutes().toString().padStart(2, "0");

  return (
    <div>
      {day} {hours.toString().padStart(2, "0")}:{minutes}
      {ampm}
    </div>
  );
}
