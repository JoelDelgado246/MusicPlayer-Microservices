export const validateRegister = ({ username, password }) => {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }
    if (username.length < 3) {
      throw new Error("Username must be at least 3 characters long");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
  };
  
  export const validateLogin = ({ username, password }) => {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }
  };
  