export function validateEmail(email) {
    // Regular expression to check if the email format is valid
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  export function validatePassword(password) {
    // Check if the password has at least 8 characters
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
  
    // Check if the password contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
  
    // Check if the password contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
  
    // Check if the password contains at least one digit
    if (!/\d/.test(password)) {
      return "Password must contain at least one digit.";
    }
  
    // Check if the password contains at least one special character
    if (!/[@#$%^&+=]/.test(password)) {
      return "Password must contain at least one special character (@, #, $, %, ^, &, +, =).";
    }
  
    // Password is valid if it passes all criteria
    return "Password is valid.";
  }