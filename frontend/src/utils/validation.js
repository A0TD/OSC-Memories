export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRegisterForm = ({
  username,
  email,
  password,
  inviteCode,
}) => {
  const errors = {};

  if (!username || username.trim().length < 3) {
    errors.username = "UserName must be at least 3 characters";
  }
  if (!validateEmail(email)) {
    errors.email = "Please enter valid email";
  }
  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters ";
  }
  if (!inviteCode || !inviteCode.trim()) {
    errors.inviteCode = "Invite code is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!validateEmail(email)) {
    errors.email = "Please enter valid email";
  }
  if (!password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
