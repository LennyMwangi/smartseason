const getFieldStatus = (field, lastUpdate) => {
  if (field.current_stage === 'Harvested') {
    return 'Completed';
  }

  if (!lastUpdate) {
    return 'At Risk';
  }

  const now = new Date();
  const last = new Date(lastUpdate.created_at);

  const diffDays = (now - last) / (1000 * 60 * 60 * 24);

  if (diffDays > 7) {
    return 'At Risk';
  }

  return 'Active';
};

module.exports = { getFieldStatus };