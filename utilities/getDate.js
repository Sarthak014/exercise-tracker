function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

function getDateFromMilli(millisec) {
  millisec = parseInt(millisec);
  return new Date(millisec).toDateString();
}

module.exports = { getCurrentDate, getDateFromMilli };
