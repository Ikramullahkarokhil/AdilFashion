import { create } from "zustand";
import db from "./Database";

const useStore = create((set, get) => ({
  searchQuery: "",
  data: [],
  selectedOption: "customer",
  totalRecords: 0,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setData: (data) => set({ data }),
  setSelectedOption: (option) => set({ selectedOption: option }),
  setTotalRecords: (total) => set({ totalRecords: total }),

  fetchCustomerData: async (searchQuery) => {
    return new Promise((resolve, reject) => {
      let query =
        "SELECT * FROM customer WHERE name LIKE ? OR phoneNumber LIKE ?";
      const queryParams = [`%${searchQuery}%`, `%${searchQuery}%`];
      db.transaction((tx) => {
        tx.executeSql(
          query,
          queryParams,
          (_, { rows: { _array } }) => {
            set({ data: _array });
            resolve(_array);
          },
          (error) => {
            console.log("Error:", error);
            reject(error);
          }
        );
      });
    });
  },

  fetchWaskatData: async (searchQuery) => {
    return new Promise((resolve, reject) => {
      let query =
        "SELECT * FROM waskat WHERE name LIKE ? OR phoneNumber LIKE ?";
      const queryParams = [`%${searchQuery}%`, `%${searchQuery}%`];
      db.transaction((tx) => {
        tx.executeSql(
          query,
          queryParams,
          (_, { rows: { _array } }) => {
            set({ data: _array });
            resolve(_array);
          },
          (error) => {
            console.log("Error:", error);
            reject(error);
          }
        );
      });
    });
  },

  fetchData: async (selectedOption, searchQuery) => {
    try {
      if (selectedOption === "customer") {
        await get().fetchCustomerData(searchQuery);
      } else if (selectedOption === "waskat") {
        await get().fetchWaskatData(searchQuery);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  fetchTotalRecords: async (selectedOption) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(id) AS total FROM ${selectedOption}`;
      db.transaction((tx) => {
        tx.executeSql(
          query,
          [],
          (_, { rows }) => {
            const { total } = rows.item(0);
            set({ totalRecords: total });
            resolve(total);
          },
          (error) => {
            console.log("Error counting total records:", error);
            reject(error);
          }
        );
      });
    });
  },

  resetStore: () => {
    set({
      searchQuery: "",
      data: [],
      selectedOption: "customer",
      totalRecords: 0,
    });
  },
}));

export default useStore;
