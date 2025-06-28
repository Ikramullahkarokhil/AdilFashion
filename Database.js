import * as SQLite from "expo-sqlite";

const databaseName = "adilFashionData";

// Initialize the database and create tables if they don’t exist
const initializeDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(databaseName);
    console.log("Database initialized:", db);

    // Create tables in a single execAsync call for efficiency
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS customer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phoneNumber TEXT,
        qad REAL,
        barDaman REAL,
        baghal REAL,
        shana REAL,
        astin REAL,
        tunban REAL,
        pacha REAL,
        yakhan TEXT,
        yakhanValue REAL,
        yakhanBin INTEGER,
        farmaish TEXT,
        daman TEXT,
        caff TEXT,
        caffValue REAL,
        jeeb TEXT,
        tunbanStyle TEXT,
        jeebTunban INTEGER,
        registrationDate DATE DEFAULT CURRENT_DATE
      );

      CREATE TABLE IF NOT EXISTS waskat (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phoneNumber TEXT,
        qad REAL,
        yakhan TEXT,
        shana REAL,
        baghal REAL,
        kamar REAL,
        soreen REAL,
        astin REAL,
        yakhanValue REAL,
        farmaish TEXT,
        registrationDate DATE DEFAULT CURRENT_DATE
      );

      CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        password TEXT
      );
    `);

    // Check and insert default admin password
    const adminRows = await db.getAllAsync("SELECT * FROM admin");
    if (adminRows.length === 0) {
      await db.runAsync("INSERT INTO admin (password) VALUES (?);", ["esmat"]);

      console.log("Default password inserted");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Execute any SQL query with parameters
export const executeSql = async (sql, params = []) => {
  try {
    const db = await SQLite.openDatabaseAsync(databaseName);
    const result = await db.execAsync(sql, params);

    return result; // Returns rows as an array
  } catch (error) {
    console.error("Error executing SQL:", error);
    throw error;
  }
};

// Delete a customer or waskat by id and table name
export const deleteCustomer = async ({ id, table }) => {
  try {
    const db = await SQLite.openDatabaseAsync(databaseName);
    await db.runAsync(`DELETE FROM ${table} WHERE id = ?;`, [id]);
  } catch (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
};

export const login = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(databaseName);
    const result = await db.getFirstAsync(`SELECT * FROM admin`);
    return result;
  } catch (error) {
    console.error("Error  Login:", error);
    throw error;
  }
};

export const fetchCustomers = async (
  table,
  query = null,
  countOnly = false
) => {
  try {
    const db = await SQLite.openDatabaseAsync(databaseName);

    if (countOnly) {
      const result = await db.getAllAsync(
        `SELECT COUNT(*) as total FROM ${table}`
      );
      return result[0];
    }

    if (query) {
      const result = await db.getAllAsync(
        `SELECT * FROM ${table} WHERE name LIKE ? OR phoneNumber LIKE ?`,
        [`%${query}%`, `%${query}%`]
      );
      return result;
    }

    const customer = await db.getAllAsync(`SELECT * FROM ${table}`);
    return customer;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const addCustomer = async (sql, params = []) => {
  try {
    const db = await SQLite.openDatabaseAsync(databaseName);
    const result = await db.execAsync(sql, params);

    return result;
  } catch (error) {
    console.error("Error executing SQL:", error);
    throw error;
  }
};

export default initializeDatabase;
