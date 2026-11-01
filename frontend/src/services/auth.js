const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function loginUser(credentials) {
  const { email, password } = credentials;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email ? email.trim() : '',
        password,
      }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorMessage =
        data?.message || `Authentication failed (${response.status})`;

      throw new Error(errorMessage);
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        'Unable to connect to auth server at ' +
        API_BASE_URL +
        '. Check if backend is running.'
      );
    }

    throw err;
  }
}

/**
 * Register a new user using existing backend POST /auth/signup
 */
export async function signupUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'Signup failed');
  }
  return data;
}

/**
 * Verify OTP using existing backend POST /auth/verify-otp
 */
export async function verifyOtp(verificationData) {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(verificationData),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'OTP verification failed');
  }
  return data;
}


/**
 * Request a password reset OTP
 */
export async function forgotPassword(email) {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim(),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to request password reset.');
  }

  return data;
}

/**
 * Reset password using OTP
 */
export async function resetPassword(resetData) {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: resetData.email.trim(),
      otp: resetData.otp,
      newPassword: resetData.newPassword,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to reset password.');
  }

  return data;
}


export default {
  loginUser,
  signupUser,
  verifyOtp,
  forgotPassword,
  resetPassword,
};
