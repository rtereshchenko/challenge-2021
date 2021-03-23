const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const dayInMs = 86_400_000;
const daysToScheduleEmails = [1, 2, 3, 4];

module.exports = {
  emailRegex,
  dayInMs,
  daysToScheduleEmails,
};
