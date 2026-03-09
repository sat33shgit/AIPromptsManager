import { create } from "zustand";

type UiState = {
  mobileSidebarOpen: boolean;
  listView: "grid" | "list";
  setMobileSidebarOpen: (value: boolean) => void;
  toggleListView: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  mobileSidebarOpen: false,
  listView: "grid",
  setMobileSidebarOpen: (value) => set({ mobileSidebarOpen: value }),
  toggleListView: () =>
    set((state) => ({
      listView: state.listView === "grid" ? "list" : "grid"
    }))
}));
