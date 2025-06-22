import type { User_Tyeps } from "../types";

export const getStoredUser = () => {
    try {
      const data = localStorage.getItem('user');
      return data ? JSON.parse(data) as User_Tyeps : null;
    } catch {
      return null;
    }
  };
  
export const getStoredUsers = () => {
    try {
      const data = localStorage.getItem('users');
      return data ? JSON.parse(data) as User_Tyeps[] : null
    } catch {
      return null;
    }
  };
  