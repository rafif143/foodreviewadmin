import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';

// Create stores
export const user = writable(null);
export const isAuthenticated = writable(false);
export const isLoading = writable(true);

// Initialize auth state
export async function initializeAuth() {
  try {
    isLoading.set(true);
    
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      user.set(session.user);
      isAuthenticated.set(true);
    } else {
      user.set(null);
      isAuthenticated.set(false);
    }
    
  } catch (error) {
    console.error('Error initializing auth:', error);
    user.set(null);
    isAuthenticated.set(false);
  } finally {
    isLoading.set(false);
  }
}

// Sign in
export async function signIn(email, password) {
  try {
    isLoading.set(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    if (data.user) {
      user.set(data.user);
      isAuthenticated.set(true);
      return { success: true };
    }
    
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  } finally {
    isLoading.set(false);
  }
}

// Sign out
export async function signOut() {
  try {
    isLoading.set(true);
    
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    user.set(null);
    isAuthenticated.set(false);
    
    return { success: true };
    
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  } finally {
    isLoading.set(false);
  }
}

// Check if user is authenticated
export function checkAuth() {
  return new Promise((resolve) => {
    const unsubscribe = isAuthenticated.subscribe((authenticated) => {
      unsubscribe();
      resolve(authenticated);
    });
  });
}

// Get current user
export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = user.subscribe((currentUser) => {
      unsubscribe();
      resolve(currentUser);
    });
  });
}

// Listen to auth changes
export function setupAuthListener() {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      user.set(session.user);
      isAuthenticated.set(true);
    } else if (event === 'SIGNED_OUT') {
      user.set(null);
      isAuthenticated.set(false);
    }
  });
}
