function buildDateFilter(query) {
  let { from, to } = query;
  const createdAtFilter = {};

  // Agar dono empty hain, default last 7 days ka range use karo
  if (!from && !to) {
    const now = new Date();
    const past = new Date();
    past.setDate(now.getDate() - 7); // last 7 days

    from = past.toISOString();
    to = now.toISOString();
  }

  if (from) {
    createdAtFilter.$gte = new Date(from);
  }
  if (to) {
    createdAtFilter.$lte = new Date(to);
  }

  return {
    filter: Object.keys(createdAtFilter).length
      ? { createdAt: createdAtFilter }
      : {},
    from,
    to
  };
}

module.exports = { buildDateFilter };