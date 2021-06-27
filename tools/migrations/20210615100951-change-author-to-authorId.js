module.exports = {
  async up(database, client) {
    await database
      .collection('games')
      .updateMany({}, { $rename: { author: 'authorId' } });
  },

  async down(database, client) {
    await database
      .collection('games')
      .updateMany({}, { $rename: { authorId: 'author' } });
  },
};
