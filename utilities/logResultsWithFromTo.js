const { getDateFromMilli } = require("./getDate");

const getLogDateWithDateString = (logs) => {
  return logs.map(({ description, duration, date }) => ({
    description,
    duration,
    date: getDateFromMilli(date),
  }));
};

function getDateQueryAndRange(startDate, endDate) {
  return startDate && endDate
    ? {
        dateQuery: 1,
        dateRange: {
          from: getDateFromMilli(startDate),
          to: getDateFromMilli(endDate),
        },
      }
    : startDate
    ? { dateQuery: 2, dateRange: { from: getDateFromMilli(startDate) } }
    : endDate
    ? { dateQuery: 3, dateRange: { to: getDateFromMilli(endDate) } }
    : {};
}

function isLogDateInRange(inputDate, dateQuery, startDate, endDate) {
  let isInRange = false;

  switch (dateQuery) {
    case 1:
      isInRange = startDate <= inputDate && inputDate < endDate;
      break;
    case 2:
      isInRange = startDate <= inputDate;
      break;
    case 3:
      isInRange = inputDate < endDate;
      break;
  }

  return isInRange;
}

module.exports = {
  getLogDateWithDateString,
  getDateQueryAndRange,
  isLogDateInRange,
};
