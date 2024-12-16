import * as SQLite from "expo-sqlite/legacy";

const databaseName = "adilFashionData";

const db = SQLite.openDatabase(databaseName);

export const initializeDatabase = async () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS customer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phoneNumber INTEGER,
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
        regestrationDate DATE
      );`
    );
    console.log("customer table created");
    tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_name ON customer (name);`);
    tx.executeSql(
      `CREATE INDEX IF NOT EXISTS idx_phoneNumber ON customer (phoneNumber);`
    );
  });
};

db.transaction((tx) => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS waskat (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phoneNumber INTEGER,
      qad REAL,
      yakhan TEXT,
      shana REAL,
      baghal REAL,
      kamar REAL,
      soreen REAL,
      astin REAL,
      yakhanValue REAL,
      regestrationDate DATE
    );`
  );
  console.log("Waskat table created");
});

db.transaction((tx) => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      password TEXT
    );`
  );
  console.log("admin table created");

  tx.executeSql(
    `SELECT * FROM admin;`,
    [],
    (_, results) => {
      if (results.rows.length === 0) {
        // If no admin found, insert default password
        tx.executeSql(
          `INSERT INTO admin (password) VALUES (?);`,
          ["esmat"], // Replace "default_password" with your desired default password
          () => console.log("Default password inserted"),
          (_, error) =>
            console.error("Error inserting default password:", error)
        );
      }
    },
    (_, error) => console.error("Error checking admin table:", error)
  );
});

export const executeSql = async (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

export default db;
