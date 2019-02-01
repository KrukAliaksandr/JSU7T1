const MongoClient = require(`mongodb`).MongoClient;

const url = `mongodb://localhost:27017/`;

// eslint-disable-next-line no-console
async function getConnection (dbUrl) {
  const client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
  return client;
}

async function simpleQuery () {
  const productOrdersMerge = await [{
    $lookup: {
      from: `products`,
      localField: `productId`,
      foreignField: `productId`,
      as: `result`
    }
  },
  {
    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: [`$result`, 0] }, `$$ROOT`] } }
  },
  { $project: { result: 0 } }
  ];
  const resultContactsMerge = await [{
    $lookup: {
      from: `contacts`,
      localField: `userId`,
      foreignField: `userId`,
      as: `result`
    }
  },
  {
    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: [`$result`, 0] }, `$$ROOT`] } }
  },
  { $project: { result: 0 } }
  ];

  const client = await getConnection(url);
  const db = await client.db(`usersdb`);
  const queryForCollectionClean = await { $or: [{ _id: { $type: 1 } }, { _id: { $type: 16 } }, { _id: { $type: 18 } }] };
  await db.collection(`qOneResult`).deleteMany(queryForCollectionClean);
  let queryResult = await db.collection(`orders`).aggregate(productOrdersMerge).toArray();
  await db.collection(`qOneResult`).insertMany(await queryResult);
  queryResult = await db.collection(`qOneResult`).aggregate(resultContactsMerge).toArray();
  await client.close();
  return queryResult;
}

module.exports = {
  simpleQuery,
  getConnection
};
