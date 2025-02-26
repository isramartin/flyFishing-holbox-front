// src/service/Auth.service.js
import mockData from "../assets/mockdata/mockdata.json";

export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    // Simular un retraso de red (opcional)
    setTimeout(() => {
      // Buscar el usuario en el JSON
      const user = mockData.users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        resolve(user); // Devuelve el usuario si las credenciales son correctas
      } else {
        reject("Correo electrónico o contraseña incorrectos");
      }
    }, 1000); // Simula un retraso de 1 segundo (como una solicitud HTTP real)
  });
};