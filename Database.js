import * as SQLite from "expo-sqlite";

// Singleton database connection
let dbInstance = null;

const databaseName = "adilFashionData43";

// Utility to validate table names
const validateTable = (table) => {
  const validTables = ["customer", "waskat", "admin"];
  if (!validTables.includes(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }
};

// Get or initialize database connection
const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(databaseName);
  }
  return dbInstance;
};

// Initialize the database with transaction support
const initializeDatabase = async () => {
  try {
    const db = await getDatabase();

    // Set PRAGMA settings outside of transaction
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;
    `);

    await db.withTransactionAsync(async () => {
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

      const adminRows = await db.getAllAsync("SELECT * FROM admin");
      if (adminRows.length === 0) {
        await db.runAsync("INSERT INTO admin (password) VALUES (?);", [
          "esmat",
        ]);
        console.log("Default admin password initialized");
      }
    });

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

// Retry logic for database operations
const withRetry = async (operation, maxRetries = 3, delay = 100) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (
        error.message.includes("database is locked") &&
        attempt < maxRetries
      ) {
        console.warn(`Retry ${attempt}/${maxRetries} due to database lock`);
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        continue;
      }
      throw error;
    }
  }
};

// Execute any SQL query with parameters
export const executeSql = async (sql, params = []) => {
  try {
    const db = await getDatabase();
    return await withRetry(async () => {
      const result = await db.getAllAsync(sql, params);
      return result;
    });
  } catch (error) {
    console.error(`SQL execution failed: ${sql}`, error);
    throw error;
  }
};

// Delete a customer or waskat by id and table name
export const deleteCustomer = async ({ id, table }) => {
  try {
    validateTable(table);
    if (!id) {
      throw new Error("ID is required for deletion");
    }

    const db = await getDatabase();
    return await withRetry(async () => {
      const result = await db.runAsync(`DELETE FROM ${table} WHERE id = ?;`, [
        id,
      ]);
      return result.changes > 0;
    });
  } catch (error) {
    console.error(`Error deleting record from ${table}:`, error);
    throw error;
  }
};

// Admin login
export const login = async () => {
  try {
    const db = await getDatabase();
    return await withRetry(async () => {
      const result = await db.getFirstAsync(`SELECT * FROM admin`);
      return result;
    });
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Fetch customers with optional search and count
export const fetchCustomers = async (
  table,
  query = null,
  countOnly = false
) => {
  try {
    validateTable(table);
    const db = await getDatabase();

    return await withRetry(async () => {
      if (countOnly) {
        const result = await db.getFirstAsync(
          `SELECT COUNT(*) as total FROM ${table}`
        );
        return result;
      }

      if (query) {
        const result = await db.getAllAsync(
          `SELECT * FROM ${table} WHERE name LIKE ? OR phoneNumber LIKE ?`,
          [`%${query}%`, `%${query}%`]
        );
        return result;
      }

      const customers = await db.getAllAsync(`SELECT * FROM ${table}`);
      return customers;
    });
  } catch (error) {
    console.error(`Error fetching customers from ${table}:`, error);
    throw error;
  }
};

// Add customer with validation
export const addCustomer = async (sql, params = []) => {
  try {
    const db = await getDatabase();
    return await withRetry(async () => {
      return await db.withTransactionAsync(async () => {
        const result = await db.runAsync(sql, params);
        if (!result) {
          throw new Error("Database operation failed");
        }
        return {
          rowsAffected: result.changes,
          insertId: result.lastInsertRowId,
        };
      });
    });
  } catch (error) {
    console.error("Error executing SQL:", error);
    throw error;
  }
};

// Add waskat with validation
export const addWaskat = async (sql, params = []) => {
  try {
    const db = await getDatabase();
    return await withRetry(async () => {
      return await db.withTransactionAsync(async () => {
        const result = await db.runAsync(sql, params);
        if (!result) {
          throw new Error("Database operation failed");
        }
        return {
          rowsAffected: result.changes,
          insertId: result.lastInsertRowId,
        };
      });
    });
  } catch (error) {
    console.error("Error executing SQL:", error);
    throw error;
  }
};

// Update customer with validation
export const updateCustomer = async (id, values) => {
  try {
    validateTable("customer");
    const db = await getDatabase();
    return await withRetry(async () => {
      return await db.withTransactionAsync(async () => {
        const result = await db.runAsync(
          `UPDATE customer SET 
          name = ?, 
          phoneNumber = ?, 
          qad = ?, 
          barDaman = ?, 
          baghal = ?, 
          shana = ?, 
          astin = ?, 
          tunban = ?, 
          pacha = ?, 
          yakhan = ?, 
          yakhanValue = ?, 
          yakhanBin = ?, 
          farmaish = ?, 
          daman = ?, 
          caff = ?, 
          caffValue = ?, 
          jeeb = ?, 
          tunbanStyle = ?, 
          jeebTunban = ?, 
          registrationDate = ? 
          WHERE id = ?`,
          [
            values.name,
            values.phoneNumber,
            values.qad,
            values.barDaman,
            values.baghal,
            values.shana,
            values.astin,
            values.tunban,
            values.pacha,
            values.yakhan,
            values.yakhanValue,
            values.yakhanBin,
            values.farmaish,
            values.daman,
            values.caff,
            values.caffValue,
            values.jeeb,
            values.tunbanStyle,
            values.jeebTunban,
            values.registrationDate,
            id,
          ]
        );
        if (!result) {
          throw new Error("Database operation failed");
        }
        return {
          rowsAffected: result.changes,
        };
      });
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

// Update waskat with validation
export const updateWaskat = async (id, values) => {
  try {
    validateTable("waskat");
    const db = await getDatabase();
    return await withRetry(async () => {
      return await db.withTransactionAsync(async () => {
        const result = await db.runAsync(
          `UPDATE waskat SET 
          name = ?, 
          phoneNumber = ?, 
          qad = ?, 
          yakhan = ?, 
          shana = ?, 
          baghal = ?, 
          kamar = ?, 
          soreen = ?, 
          astin = ?,
          yakhanValue = ?,
          farmaish = ?, 
          registrationDate = ? 
          WHERE id = ?`,
          [
            values.name,
            values.phoneNumber,
            values.qad,
            values.yakhan,
            values.shana,
            values.baghal,
            values.kamar,
            values.soreen,
            values.astin,
            values.yakhanValue,
            values.farmaish,
            values.registrationDate,
            id,
          ]
        );
        if (!result) {
          throw new Error("Database operation failed");
        }
        return {
          rowsAffected: result.changes,
        };
      });
    });
  } catch (error) {
    console.error("Error updating waskat:", error);
    throw error;
  }
};

// Check if record exists in a table
export const checkRecordExists = async (table, id) => {
  try {
    validateTable(table);
    const db = await getDatabase();
    return await withRetry(async () => {
      const result = await db.getFirstAsync(
        `SELECT * FROM ${table} WHERE id = ?`,
        [id]
      );
      return result !== null;
    });
  } catch (error) {
    console.error(`Error checking record in ${table}:`, error);
    throw error;
  }
};

// Insert customer data during restore
export const restoreCustomer = async (customerData) => {
  try {
    validateTable("customer");
    const db = await getDatabase();
    return await withRetry(async () => {
      return await db.withTransactionAsync(async () => {
        const result = await db.runAsync(
          `INSERT INTO customer (
            id, name, phoneNumber, qad, barDaman, baghal, shana, astin, 
            tunban, pacha, yakhan, yakhanValue, farmaish, daman, caff, 
            caffValue, jeeb, tunbanStyle, jeebTunban, registrationDate
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            customerData.id,
            customerData.name || "",
            customerData.phoneNumber || "",
            customerData.qad || "",
            customerData.barDaman || "",
            customerData.baghal || "",
            customerData.shana || "",
            customerData.astin || "",
            customerData.tunban || "",
            customerData.pacha || "",
            customerData.yakhan || "",
            customerData.yakhanValue || "",
            customerData.farmaish || "",
            customerData.daman || "",
            customerData.caff || "",
            customerData.caffValue || "",
            customerData.jeeb || "",
            customerData.tunbanStyle || "",
            customerData.jeebTunban || "",
            customerData.registrationDate ||
              new Date().toISOString().split("T")[0],
          ]
        );
        return result.changes > 0;
      });
    });
  } catch (error) {
    console.error("Error restoring customer:", error);
    throw error;
  }
};

// Insert waskat data during restore
export const restoreWaskat = async (waskatData) => {
  try {
    validateTable("waskat");
    const db = await getDatabase();
    return await withRetry(async () => {
      return await db.withTransactionAsync(async () => {
        const result = await db.runAsync(
          `INSERT INTO waskat (
            id, name, phoneNumber, qad, yakhan, shana, baghal, kamar, 
            soreen, astin, farmaish, registrationDate
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            waskatData.id,
            waskatData.name || "",
            waskatData.phoneNumber || "",
            waskatData.qad || "",
            waskatData.yakhan || "",
            waskatData.shana || "",
            waskatData.baghal || "",
            waskatData.kamar || "",
            waskatData.soreen || "",
            waskatData.astin || "",
            waskatData.farmaish || "",
            waskatData.registrationDate ||
              new Date().toISOString().split("T")[0],
          ]
        );
        return result.changes > 0;
      });
    });
  } catch (error) {
    console.error("Error restoring waskat:", error);
    throw error;
  }
};

// Change admin password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    validateTable("admin");
    const db = await getDatabase();

    return await withRetry(async () => {
      // First verify the current password
      const admin = await db.getFirstAsync(
        `SELECT * FROM admin WHERE password = ?`,
        [currentPassword]
      );

      if (!admin) {
        throw new Error("Current password is incorrect");
      }

      // Update the password
      const result = await db.runAsync(
        `UPDATE admin SET password = ? WHERE password = ?`,
        [newPassword, currentPassword]
      );

      if (!result || result.changes === 0) {
        throw new Error("Failed to update password");
      }

      // Return success object directly without transaction wrapper
      return {
        success: true,
        message: "Password changed successfully",
      };
    });
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export default initializeDatabase;
