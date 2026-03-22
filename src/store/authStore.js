import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      school: null,
      login: (data) => set({
        token: data.accessToken,
        user: { role: data.role, language: data.preferredLanguage },
        school: data.school,
      }),
      logout: () => set({ token: null, user: null, school: null }),
    }),
    { name: 'edukira_auth' }
  )
);

export default useAuthStore;