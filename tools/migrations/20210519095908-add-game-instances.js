module.exports = {
  async up(database, client) {
    await database
      .collection('games')
      .updateMany({}, { $set: { instances: {} } });
  },

  async down(database, client) {
    await database
      .collection('games')
      .updateMany({}, { $unset: { instances: null } });
  },
};
