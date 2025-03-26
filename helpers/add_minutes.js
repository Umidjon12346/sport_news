function addMinute(date, min) {
  return new Date(date.getTime() + min * 60000);
}

module.exports = { addMinute };
