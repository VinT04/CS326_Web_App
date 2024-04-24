const db = new PouchDB("ClimaSense");


export async function saveData(name, value) {
  await db.put({ _id: name, value });
}


export async function modifyData(doc) {
    await db.put(doc);
}


export async function loadData(name) {
    const val = db.get(name);
    return val;
}

export async function removeData(name) {
  db.remove(name);
}


export async function loadAllData() {
  const result = await db.allDocs({ include_docs: true });
  return result.rows.map((row) => row.doc);
}
