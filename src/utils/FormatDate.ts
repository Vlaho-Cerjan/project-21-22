export const FormatDate = (date: Date): string => {
  return date.toLocaleDateString(['en-US'], {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
  });
};

export const FormatDateWithTime = (date: Date): string => {
  return date.toLocaleDateString(['en-US'], {
    hour: 'numeric',
    minute: 'numeric',
    year: '2-digit',
    month: 'short',
    day: 'numeric',
  });
};
