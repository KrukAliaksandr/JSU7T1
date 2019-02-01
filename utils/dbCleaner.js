
// eslint-disable-next-line no-unused-vars
const MongoClient = require(`mongodb`).MongoClient;
const url = `mongodb://localhost:27017/`;

async function dropAllTables () {
  // eslint-disable-next-line no-undef
  const client = await getConnection(url);
  const db = await client.db(`usersdb`);
  await db.collection(`contacts`).drop();
  await db.collection(`orders`).drop();
  await db.collection(`products`).drop();
  client.close();
}

module.exports = {
  dropAllTables
};
