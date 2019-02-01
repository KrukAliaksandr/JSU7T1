/* eslint-disable no-console */
const fs = require(`fs`);
const { google } = require(`googleapis`);
const credentials = require(`../data/credentials.json`).installed;
const util = require(`util`);
const docId = `1Oz-wxvVuotqCo25UIwkNnVhqf2nDyrz6aokYz0Py80I`;

const TOKEN_PATH = `./data/token.json`;

async function writeToExcel (result) {
  const auth = await setToken(await getCredentials());
  const reqResult = await writeTo(auth, docId, result);
  return reqResult;
}

async function readFromExcel () {
  const auth = await setToken(await getCredentials());
  const reqResult = await readFrom(auth, docId, `A2:H`);
  return reqResult;
}

async function clearExcelList () {
  const auth = await setToken(await getCredentials());
  await clearList(auth);
}

async function clearList (auth) {
  const sheets = await google.sheets({ version: `v4`, auth });
  try {
    sheets.spreadsheets.values.clear({
      spreadsheetId: docId,
      range: `A1:H`
    });
  } catch (err) {
    console.log(err);
  }
}

async function getCredentials () {
  // eslint-disable-next-line camelcase
  const { client_secret, client_id, redirect_uris } = credentials;
  const auth = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  return auth;
}

async function setToken (auth) {
  const fsRead = util.promisify(fs.readFile);
  const token = await fsRead(TOKEN_PATH);
  auth.setCredentials(JSON.parse(token));
  return auth;
}

async function writeTo (auth, spreadsheetId, values) {
  const sheets = google.sheets({ version: `v4`, auth });
  const updateWrapper = util.promisify(sheets.spreadsheets.values.update);
  const resource = {
    values
  };
  try {
    const response = await updateWrapper({
      spreadsheetId: spreadsheetId,
      range: `Info!A2:G`,
      valueInputOption: `RAW`,
      resource
    });
    console.log(await response.config.url);
    return await response;
  } catch (err) {
    return err;
  }
}

async function readFrom (auth, spreadsheetId, range) {
  const sheets = await google.sheets({ version: `v4`, auth });
  const getWrapper = await util.promisify(sheets.spreadsheets.values.get);
  try {
    const response = await getWrapper({
      spreadsheetId: spreadsheetId,
      range: range,
      valueRenderOption: `UNFORMATTED_VALUE`
    });

    return response;
  } catch (err) {
    return err;
  }
}

async function combineDataToArray (data) {
  const values = [];
  // adding headers as first array from the first data object property names
  values.unshift(Object.keys(data[0]).slice(1));
  data.forEach(val => {
    values[values.length] = [val.userId, val.name, val.address, val.phone, val.cardID, val.productId, val.description];
  });
  return values;
}

module.exports = {
  writeToExcel,
  readFromExcel,
  clearExcelList,
  combineDataToArray,
  getCredentials,
  setToken,
  writeTo,
  readFrom
};
