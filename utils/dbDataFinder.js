const MongoClient = require(`mongodb`).MongoClient;
const url = `mongodb://localhost:27017/`;

MongoClient.connect(url, function (err, client) {
  if (err) throw err;
  const db = client.db(`usersdb`);
  db.collection(`phones`).find().toArray(function (err, result) {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(result);
    client.close();
  });
});
