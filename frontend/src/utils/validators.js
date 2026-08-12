export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const isValidPhone = (phone) => {
  const re = /^\+?[\d\s-]{10,14}$/;
  return re.test(phone);
};

export const validateFile = (file, maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) => {
  if (!file) return { valid: false, error: "File is required." };
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Invalid file type." };
  }
  
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return { valid: false, error: `File size must be less than ${maxSizeMB}MB.` };
  }
  
  return { valid: true };
};
