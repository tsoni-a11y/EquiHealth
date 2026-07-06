import { supabase } from './supabaseClient';

// Get all records from a table
export const getRecords = async (tableName, filters = {}) => {
  try {
    let query = supabase.from(tableName).select('*');

    // Apply filters if provided
    Object.keys(filters).forEach((key) => {
      query = query.eq(key, filters[key]);
    });

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching from ${tableName}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error getting records from ${tableName}:`, error);
    throw error;
  }
};

// Get a single record by ID
export const getRecordById = async (tableName, id) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching record from ${tableName}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error getting record by ID from ${tableName}:`, error);
    throw error;
  }
};

// Insert a new record
export const insertRecord = async (tableName, record) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert([record])
      .select();

    if (error) {
      console.error(`Error inserting into ${tableName}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error inserting record into ${tableName}:`, error);
    throw error;
  }
};

// Update a record
export const updateRecord = async (tableName, id, updates) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Error updating ${tableName}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error updating record in ${tableName}:`, error);
    throw error;
  }
};

// Delete a record
export const deleteRecord = async (tableName, id) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error deleting record from ${tableName}:`, error);
    throw error;
  }
};
