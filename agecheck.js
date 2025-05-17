function checkAge(age) {
  if (age < 10) return 'blocked';
  if (age <= 15) return 'limit-3h';
  return 'limit-7h';
}

function getLimitFromGroup(group) {
  if (group === 'blocked') return 0;
  if (group === 'limit-3h') return 180;
  if (group === 'limit-7h') return 420;
  return 0;
}

module.exports = { checkAge, getLimitFromGroup };
