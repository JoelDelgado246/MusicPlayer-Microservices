const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_URL = `${BASE_URL}/auth`;

export const loginUser = async (email, contraseña) => {
  console.log("🟡 Enviando datos a login:", { email, contraseña });

  const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contraseña }),  // 🔥 Asegurar que los nombres de los campos son correctos
  });

  if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error en loginUser:", errorData);
      throw new Error(errorData.error || "Credenciales incorrectas");
  }

  const data = await response.json();
  console.log("✅ Respuesta del backend en loginUser:", data);
  return data;
};



export const registerUser = async (email, contraseña) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contraseña }),
  });

  if (!response.ok) {
    throw new Error("Error al registrarse. Por favor, verifica los datos.");
  }

  return await response.json();
};
