import PouchDB from "pouchdb";
const db = new PouchDB("ClimaSense");

/**
 * Asynchronously saves a new data item to the database with a specified name and
 * value. If an item with the same name already exists, it will be
 * overwritten.
 *
 * @async
 * @param {string} name - The unique identifier for the doc.
 * @param {any} value - The initial value for the attribute.
 * @returns {Promise<void>} - A promise that resolves when the data has been
 * successfully saved.
 * @throws {Error} - Throws an error if the operation fails, e.g., due to
 * database connectivity issues.
 */
export async function saveData(name, value) {
  await db.put({ _id: name, value });
}

/**
 * Asynchronously saves a new data item to the database with a specified name and
 * value. If an item with the same name already exists, it will be
 * overwritten.
 *
 * @async
 * @param {Object} doc - The data document to be updated. Must include `_id`
 * and `count` properties.
 * @returns {Promise<void>} - A promise that resolves when the data has been
 * successfully saved.
 * @throws {Error} - Throws an error if the operation fails, e.g., due to
 * database connectivity issues.
 */
export async function modifyData(doc) {
    await db.put(doc);
}

/**
 * Asynchronously retrieves a data item from the database by its name.
 *
 * @async
 * @param {string} name - The name of the data item to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the data document.
 * @throws {Error} - Throws an error if the data item cannot be found or if there
 * is a database issue.
 */
export async function loadData(name) {
    const val = db.get(name);
    return val;
}

/**
 * Asynchronously removes a counter from the database by its name.
 *
 * @async
 * @param {string} name - The name of the data item to be removed.
 * @returns {Promise<void>} - A promise that resolves when the data item has been
 * successfully removed.
 * @throws {Error} - Throws an error if the data item cannot be removed, e.g., it
 * does not exist or due to database issues.
 */
export async function removeData(name) {
  db.remove(name);
}

/**
 * Asynchronously retrieves all data items from the database.
 *
 * @async
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of
 * data documents.
 * @throws {Error} - Throws an error if there is a problem accessing the
 * database.
 */
export async function loadAllData() {
  const result = await db.allDocs({ include_docs: true });
  return result.rows.map((row) => row.doc);
}
