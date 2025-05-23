function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  auth.signInWithPopup(provider)
    .then((result) => {
      // Usuario autenticado
      const user = result.user;
      console.log("Usuario autenticado:", user);
    })
    .catch((error) => {
      // Manejo de errores
      console.error("Error de autenticación:", error);
    });
}