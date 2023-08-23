function isDateValid(date) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  return regEx.test(date);
}

function isLimitValid(limit) {
  const logLimit = parseInt(limit);

  if (typeof logLimit !== 'number') {
    return false;
  }
  return Number.isInteger(logLimit);
}

module.exports = { isDateValid, isLimitValid };
