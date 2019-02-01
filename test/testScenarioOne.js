/* eslint-disable no-undef */
const path = require(`path`);
const chai = require(`chai`);
const expect = chai.expect;
const dbMethods = require(path.resolve(`./src/dbMethods.js`));
const sheetCommands = require(path.resolve(`./src/sheetCommands.js`));
const docId = `1Oz-wxvVuotqCo25UIwkNnVhqf2nDyrz6aokYz0Py80I`;

// Correct
describe(`#check correct update requests`, function () {
  it(`should return code 200 if request is correct`, async function () {
    const queryResult = await dbMethods.simpleQuery();
    const values = await sheetCommands.combineDataToArray(queryResult);
    const response = await sheetCommands.writeToExcel(values);
    expect(response.status).to.be.equal(200);
  });

  it(`should return same Data that was sent to server`, async function () {
    const queryResult = await dbMethods.simpleQuery();
    const values = await sheetCommands.combineDataToArray(queryResult);
    await sheetCommands.writeToExcel(values);
    const response = await sheetCommands.readFromExcel();
    values.forEach((line) => {
      line.forEach((cell) => {
        expect(cell).to.be.equal((response.data.values)[values.indexOf(line)][line.indexOf(cell)]);
      });
    });
  });

  it(`should return 'ESF' as server header value`, async function () {
    const queryResult = await dbMethods.simpleQuery();
    const values = await sheetCommands.combineDataToArray(queryResult);
    const response = await sheetCommands.writeToExcel(values);
    expect(response.headers.server).to.be.equal(`ESF`);
  });

  it(`should return 'close' as connection header value`, async function () {
    const queryResult = await dbMethods.simpleQuery();
    const values = await sheetCommands.combineDataToArray(queryResult);
    const response = await sheetCommands.writeToExcel(values);
    expect(response.headers.connection).to.be.equal(`close`);
  });

  it(`should return 'close' as connection url value`, async function () {
    const queryResult = await dbMethods.simpleQuery();
    const values = await sheetCommands.combineDataToArray(queryResult);
    const response = await sheetCommands.writeToExcel(values);
    expect(response.config.url).to.be.contain(docId);
  });

  it(`should return code 200 if request is correct`, async function () {
    const auth = await setToken(await getCredentials());
    const response = await sheetCommands.readFrom(auth, docId, `A1:G`);
    expect(response.status).to.be.equal(200);
  });
});

// Bad Data
describe(`#check incorrect update requests`, function () {
  it(`should return code 400 if data is bad`, async () => {
    const errorObject = await sheetCommands.writeToExcel(357);
    expect(errorObject.code).to.be.equal(400);
  });

  it(`should return code 401 if credentials are incorrect`, async function () {
    const queryResult = await dbMethods.simpleQuery();
    const values = await sheetCommands.combineDataToArray(queryResult);
    const errorObject = await sheetCommands.writeTo(null, docId, values);
    expect(errorObject.code).to.be.equal(401);
  });

  it(`should return code 404 if document id is incorrect`, async function () {
    const queryResult = await dbMethods.simpleQuery();
    const values = await sheetCommands.combineDataToArray(queryResult);
    const auth = await sheetCommands.setToken(await sheetCommands.getCredentials());
    const errorObject = await sheetCommands.writeTo(auth, `1Oz-wxvVuctqCo25UIwkNnVhqf2nDyrz6aokYz0Py80I`, values);
    expect(errorObject.code).to.be.equal(404);
  });

  it(`should return code 403 if trying to write to other user's document`, async function () {
    const queryResult = await dbMethods.simpleQuery();
    const values = await sheetCommands.combineDataToArray(queryResult);
    const auth = await sheetCommands.setToken(await sheetCommands.getCredentials());
    const errorObject = await sheetCommands.writeTo(auth, `1_h0IJNVSFt3spK_jmC8Hv4GUVPjTKVDMPWPQv_VD8Mw`, values);
    expect(errorObject.code).to.be.equal(403);
  });
});
