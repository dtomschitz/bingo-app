const config = {
  mongodb: {
    url: 'mongodb://root:rootPassword@localhost:27017',
    databaseName: 'saturn',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'tools/migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
};

module.exports = config;
