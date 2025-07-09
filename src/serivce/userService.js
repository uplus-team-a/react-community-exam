import supabase from "../libs/supabase.js";
import {hashPassword, verifyPassword} from '../utils/passwordUtils';

/**
 * Authenticate a user by email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const authenticateUserByEmail = async (email, password) => {
  try {
    const {
      data,
      error: userError
    } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) {
      return {
        data: null,
        error: {
          message: 'Authentication failed: Database error',
          code: 'AUTH_ERROR'
        }
      };
    }

    if (!data) {
      return {
        data: null,
        error: {
          message: 'Invalid credentials',
          code: 'AUTH_ERROR'
        }
      };
    }

    // For this implementation, we're assuming the password is stored in the database
    // In a real application, you would need to ensure passwords are properly stored
    const isPasswordValid = await verifyPassword(password, data.password);

    if (!isPasswordValid) {
      return {
        data: null,
        error: {
          message: 'Invalid credentials',
          code: 'AUTH_ERROR'
        }
      };
    }

    return {
      data: data,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message: 'Authentication failed: ' + error.message,
        code: 'AUTH_ERROR'
      }
    };
  }
};

/**
 * Get all users
 * @returns {Promise<{data: Array, error: Object}>}
 */
export const getUsers = async () => {
  const {
    data,
    error
  } = await supabase
    .from('users')
    .select('*')
    .is('is_active', true)
    .order('username', {ascending: true});

  return {
    data,
    error
  };
};

/**
 * Get a user by ID
 * @param {string} id - User ID
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const getUserById = async (id) => {
  const {
    data,
    error
  } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', id)
    .single();

  return {
    data,
    error
  };
};

/**
 * Create a new user
 * @param {Object} user - User data
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const createUser = async (user) => {
  try {
    const hashedPassword = await hashPassword(user.password);

    const {
      data,
      error
    } = await supabase
      .from('users')
      .insert([
        {
          user_id: user.id,
          username: user.username,
          email: user.email,
          password: hashedPassword,
          nickname: user.nickname || null,
          profile_image_url: user.profileImageUrl || null,
          is_active: true,
          is_admin: user.isAdmin || false,
        }
      ])
      .select();

    return {
      data: data?.[0] || null,
      error
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message: 'Failed to create user: ' + error.message,
        code: 'USER_CREATION_ERROR'
      }
    };
  }
};

/**
 * Update a user
 * @param {string} id - User ID
 * @param {Object} user - Updated user data
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const updateUser = async (id, user) => {
  try {
    const updateData = {};

    if (user.username !== undefined) updateData.username = user.username;
    if (user.email !== undefined) updateData.email = user.email;
    if (user.password !== undefined) {
      updateData.password = await hashPassword(user.password);
    }
    if (user.nickname !== undefined) updateData.nickname = user.nickname;
    if (user.profileImageUrl !== undefined) updateData.profile_image_url = user.profileImageUrl;
    if (user.isActive !== undefined) updateData.is_active = user.isActive;
    if (user.isAdmin !== undefined) updateData.is_admin = user.isAdmin;

    updateData.modified_at = new Date();

    const {
      data,
      error
    } = await supabase
      .from('users')
      .update(updateData)
      .eq('user_id', id)
      .select();

    return {
      data: data?.[0] || null,
      error
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message: 'Failed to update user: ' + error.message,
        code: 'USER_UPDATE_ERROR'
      }
    };
  }
};

/**
 * Delete a user (soft delete)
 * @param {string} id - User ID
 * @returns {Promise<{error: Object}>}
 */
export const deleteUser = async (id) => {
  const {error} = await supabase
    .from('users')
    .update({
      is_active: false,
      modified_at: new Date()
    })
    .eq('user_id', id);

  return {error};
};

/**
 * Authenticate a user
 * @param {string} id - User ID
 * @param {string} password - User password
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const authenticateUser = async (id, password) => {
  try {
    const {
      data,
      error: userError
    } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', id)
      .is('is_active', true);

    if (userError) {
      return {
        data: null,
        error: {
          message: 'Authentication failed: Database error',
          code: 'AUTH_ERROR'
        }
      };
    }

    if (!data || data.length === 0) {
      return {
        data: null,
        error: {
          message: 'Invalid credentials',
          code: 'AUTH_ERROR'
        }
      };
    }

    const user = data[0];
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return {
        data: null,
        error: {
          message: 'Invalid credentials',
          code: 'AUTH_ERROR'
        }
      };
    }

    return {
      data: user,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message: 'Authentication failed: ' + error.message,
        code: 'AUTH_ERROR'
      }
    };
  }
};

/**
 * Check if a user ID is available
 * @param {string} id - User ID to check
 * @returns {Promise<{available: boolean, error: Object}>}
 */
export const checkUserIdAvailability = async (id) => {
  const {
    count,
    error
  } = await supabase
    .from('users')
    .select('*', {count: 'exact'})
    .eq('user_id', id);

  if (error) {
    return {
      available: false,
      error
    };
  }

  return {
    available: count === 0,
    error: null
  };
};

/**
 * Get multiple users by their IDs
 * @param {Array<string>} ids - Array of user IDs
 * @returns {Promise<{data: Array, error: Object}>}
 */
export const getUsersById = async (ids) => {
  if (!ids || ids.length === 0) {
    return {data: [], error: null};
  }

  const {data, error} = await supabase
    .from('users')
    .select('*')
    .in('user_id', ids)
    .is('is_active', true);

  return {data, error};
};

/**
 * Get multiple users by their numeric IDs
 * @param {Array<number>} ids - Array of user numeric IDs
 * @returns {Promise<{data: Array, error: Object}>}
 */
export const getUsersByNumericId = async (ids) => {
  if (!ids || ids.length === 0) {
    return {data: [], error: null};
  }

  const {data, error} = await supabase
    .from('users')
    .select('*')
    .in('id', ids)
    .is('is_active', true);

  return {data, error};
};
