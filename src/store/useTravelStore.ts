import { create } from "zustand";

interface TravelStore {
  selectedTravelId: string | null;
  setSelectedTravelId: (id: string | null) => void;
}

export const useTravelStore = create<TravelStore>((set) => ({
  selectedTravelId: null,
  setSelectedTravelId: (id) => set({ selectedTravelId: id }),
}));
