export const timeSinceUpdate = (inputDate: string | Date): string => {
  const currentTime: Date = new Date();
  const updatedTime: Date = new Date(inputDate);

  if (isNaN(updatedTime.getTime())) {
    throw new Error("Data inválida fornecida.");
  }

  const timeDifferenceMs: number = currentTime.getTime() - updatedTime.getTime();

  const elapsedMinutes: number = Math.floor(timeDifferenceMs / (1000 * 60));
  const elapsedHours: number = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
  const elapsedDays: number = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));

  if (elapsedDays > 0) return `${elapsedDays}d`;
  if (elapsedHours > 0) return `${elapsedHours}h`;
  if (elapsedMinutes > 0) return `${elapsedMinutes}m`;

  return "agora";
};
