import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpExpiry, setOtpExpiry] = useState(null);
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

  const saveUserAuth = async (authUser) => {
    setUser(authUser);
    await AsyncStorage.setItem('user', JSON.stringify(authUser));
  };

  const clearOtp = () => {
    setGeneratedOtp(null);
    setOtpExpiry(null);
  };

  const getRandomUint32 = () => {
    const randomSource = new Uint32Array(1);
    if (globalThis.crypto?.getRandomValues) {
      globalThis.crypto.getRandomValues(randomSource);
    } else {
      randomSource[0] = Math.floor(Math.random() * 2 ** 32);
    }
    return randomSource[0];
  };

  const sendOtp = (phone) => {
    const otpRange = 900000;
    const maxUnbiasedValue = Math.floor(2 ** 32 / otpRange) * otpRange - 1;

    let randomValue = getRandomUint32();
    while (randomValue > maxUnbiasedValue) {
      randomValue = getRandomUint32();
    }

    const otp = String(100000 + (randomValue % otpRange));
    const expiry = Date.now() + 5 * 60 * 1000;

    setGeneratedOtp(otp);
    setOtpExpiry(expiry);

    console.log(`[Demo OTP] ${phone}: ${otp}`);
  };

  const verifyOtp = (inputOtp) => {
    if (!generatedOtp || !otpExpiry) {
      return { success: false, reason: 'missing' };
    }

    if (Date.now() >= otpExpiry) {
      clearOtp();
      return { success: false, reason: 'expired' };
    }

    if (inputOtp !== generatedOtp) {
      return { success: false, reason: 'invalid' };
    }

    clearOtp();
    return { success: true };
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
    saveUserAuth,
    userProfile,
    updateUserProfile,
    generatedOtp,
    otpExpiry,
    sendOtp,
    verifyOtp,
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