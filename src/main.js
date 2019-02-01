/* eslint-disable no-unused-vars */
const todo = require(`yargs`);
const queryModules = require(`./dbMethods`);
const sheetCommands = require(`./sheetCommands`);
const dbFiller = require(`../utils/dbFiller`);
const dbCleaner = require(`../utils/dbCleaner`);

// eslint-disable-next-line no-unused-expressions
todo.command(`write`, `writes data to spreadsheet`, {}, async () => {
  const results = await queryModules.simpleQuery();
  const values = await sheetCommands.combineDataToArray(results);
  await sheetCommands.writeToExcel(values);
}).command(`get`, `get data from spreadsheets`, {}, async () => {
  await sheetCommands.readFromExcel();
}).command(`clear`, `get data from spreadsheets`, {}, async () => {
  await sheetCommands.clearExcelList();
}).argv;
