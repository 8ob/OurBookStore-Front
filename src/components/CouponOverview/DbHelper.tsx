// DbHelper.ts
// import initSqlJs, { Database } from 'sql.js';
import couponsDbFile from './coupons.db?url';

let dbInstance: Database | null = null;

async function GetDb(sql: string) {
  if (!dbInstance) {
    const SQL = await initSqlJs({
      locateFile: () => `https://sql.js.org/dist/sql-wasm.wasm`
    });

    const dbFileResponse = await fetch(couponsDbFile);
    const dbFileBuffer = await dbFileResponse.arrayBuffer();
    dbInstance = new SQL.Database(new Uint8Array(dbFileBuffer));
  }

  // Execute the SQL query
  const result = dbInstance.exec(sql);

  return result;
}

export default GetDb;
