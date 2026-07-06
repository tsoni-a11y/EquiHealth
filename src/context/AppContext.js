import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load language preference on app start
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const updateLanguage = async (newLanguage) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem('language', newLanguage);
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  const updateUserProfile = (newProfile) => {
    setUserProfile(newProfile);
  };

  const logout = async () => {
    try {
      setUser(null);
      setUserProfile(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    language,
    updateLanguage,
    user,
    updateUser,
    userProfile,
    updateUserProfile,
    logout,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};