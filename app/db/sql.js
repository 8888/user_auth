const sql = (strings, ...values) => {
  const text = strings.reduce((query, current, idx) => `${query}$${idx}${current}`);
  return { text, values };
};

module.exports = { sql };
