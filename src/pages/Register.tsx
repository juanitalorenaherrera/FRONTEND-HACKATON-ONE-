const Register = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Registro</h2>
      <form>
        <input type="text" placeholder="Nombre" /><br /><br />
        <input type="email" placeholder="Correo" /><br /><br />
        <input type="password" placeholder="Contraseña" /><br /><br />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
