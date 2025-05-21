import { create } from "zustand";
import db from "./Database";

const useStore = create((set) => ({
  searchQuery: "",
  data: [],
  selectedOption: "customer",
  totalRecords: 0,
  loadedRecords: 10,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setData: (data) => set({ data }),
  setSelectedOption: (option) => set({ selectedOption: option }),
  setTotalRecords: (total) => set({ totalRecords: total }),
  setLoadedRecords: (records) => set({ loadedRecords: records }),

  fetchCustomerData: async (searchQuery, limit, offset) => {
    let query =
      "SELECT * FROM customer WHERE name LIKE ? OR phoneNumber LIKE ? LIMIT ? OFFSET ?";
    const queryParams = [`%${searchQuery}%`, `%${searchQuery}%`, limit, offset];
    db.transaction((tx) => {
      tx.executeSql(
        query,
        queryParams,
        (_, { rows: { _array } }) => {
          if (offset === 0) {
            set({ data: _array });
          } else {
            set((state) => ({
              data: [...state.data, ..._array],
            }));
          }
        },
        (error) => {
          console.log("Error:", error);
        }
      );
    });
  },

  fetchWaskatData: async (searchQuery, limit, offset) => {
    let query =
      "SELECT * FROM waskat WHERE name LIKE ? OR phoneNumber LIKE ? LIMIT ? OFFSET ?";
    const queryParams = [`%${searchQuery}%`, `%${searchQuery}%`, limit, offset];
    db.transaction((tx) => {
      tx.executeSql(
        query,
        queryParams,
        (_, { rows: { _array } }) => {
          if (offset === 0) {
            set({ data: _array });
          } else {
            set((state) => ({
              data: [...state.data, ..._array],
            }));
          }
        },
        (error) => {
          console.log("Error:", error);
        }
      );
    });
  },

  fetchData: async (selectedOption, searchQuery, limit, offset) => {
    if (selectedOption === "customer") {
      await useStore.getState().fetchCustomerData(searchQuery, limit, offset);
    } else if (selectedOption === "waskat") {
      await useStore.getState().fetchWaskatData(searchQuery, limit, offset);
    }
  },

  fetchTotalRecords: async (selectedOption) => {
    const query = `SELECT COUNT(id) AS total FROM ${selectedOption}`;
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (_, { rows }) => {
          const { total } = rows.item(0);
          set({ totalRecords: total });
        },
        (error) => {
          console.log("Error counting total records:", error);
        }
      );
    });
  },
}));

export default useStore;
