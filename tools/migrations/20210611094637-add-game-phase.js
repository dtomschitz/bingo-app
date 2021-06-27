module.exports = {
  async up(database, client) {
    await database
      .collection('games')
      .updateMany({}, { $set: { phase: 'EDITING' } });
  },

  async down(database, client) {
    await database
      .collection('games')
      .updateMany({}, { $unset: { phase: null } });
  },
};
