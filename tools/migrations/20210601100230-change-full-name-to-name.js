module.exports = {
  async up(database, client) {
    const users = await database.collection('users').find({}).toArray();
    const operations = users.map(user => {
      const firstName = user.firstName;
      const lastName = user.lastName;

      return database.collection('users').updateOne(
        { _id: user._id },
        {
          $set: {
            name: `${firstName} ${lastName}`,
          },
          $unset: {
            firstName: null,
            lastName: null,
          },
        },
      );
    });

    return Promise.all(operations);
  },

  async down(database, client) {
    const users = await database.collection('users').find({}).toArray();
    const operations = users.map(user => {
      const [firstName, lastName] = user.name.split(' ');

      return database.collection('users').updateOne(
        { _id: user._id },
        {
          $set: {
            firstName,
            lastName,
          },
          $unset: {
            name: null,
          },
        },
      );
    });

    return Promise.all(operations);
  },
};
