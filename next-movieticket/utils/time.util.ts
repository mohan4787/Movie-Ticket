export const getFullDateTime = (date: string, time: string) => {
  return new Date(`${date.split("T")[0]} ${time}`);
};

export const getHour = (date: string, time: string) => {
  return getFullDateTime(date, time).getHours();
};

export const formatTime = (date: string, time: string) => {
  return getFullDateTime(date, time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};