import React, { createContext, useContext, useState, useEffect } from 'react';

export const USERS_LIST = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+91 9876543210',
    address: '42 Silicon Avenue, Tech Park, Bangalore 560001',
    role: 'customer',
    label: 'User 1: Alex Johnson'
  },
  {
    id: 2,
    name: 'Sophia Patel',
    email: 'sophia@example.com',
    phone: '+91 9123456789',
    address: '77 Marine Lines, Mumbai 400020',
    role: 'customer',
    label: 'User 2: Sophia Patel'
  },
  {
    id: 99,
    name: 'Admin User',
    email: 'admin@shopzone.com',
    phone: '+91 9999999999',
    address: 'ShopZone HQ, Level 10, New Delhi 110001',
    role: 'admin',
    label: 'Admin Portal'
  }
];

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('shopzone_active_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = USERS_LIST.find(u => u.id === parsed.id);
        if (match) return match;
      } catch (e) {
        // ignore
      }
    }
    return USERS_LIST[0]; // Alex Johnson (User 1)
  });

  // Save current active user on change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('shopzone_active_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const selectUser = (userId) => {
    const found = USERS_LIST.find(u => u.id === Number(userId));
    if (found) {
      setCurrentUser(found);
      return found;
    }
    return currentUser;
  };

  return (
    <UserContext.Provider value={{
      currentUser: currentUser || USERS_LIST[0],
      usersList: USERS_LIST,
      selectUser,
      setCurrentUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}


