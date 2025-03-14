import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useStatsStore = create(
  persist(
    (set) => ({
      stats: [],
      fetchedAt: null,
      setStats(stats) {
        set({ stats });
      },
      setFetchedAt(fetchedAt) {
        set({ fetchedAt });
      },
    }),
    {
      name: 'stats',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStatsStore;
