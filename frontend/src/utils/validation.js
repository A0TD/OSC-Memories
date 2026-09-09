export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRegisterForm = ({ username, email, password, inviteCode }) => {
  const errors = {};
  
  if (!username || username.trim().length < 3) {
    errors.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
  }
  if (!validateEmail(email)) {
    errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
  }
  if (!password || password.length < 6) {
    errors.password = 'كلمة السر يجب أن تكون 6 أحرف على الأقل';
  }
  if (!inviteCode || !inviteCode.trim()) {
    errors.inviteCode = 'كود الدعوة (Invite Code) مطلوب';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!validateEmail(email)) {
    errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
  }
  if (!password) {
    errors.password = 'كلمة السر مطلوبة';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};