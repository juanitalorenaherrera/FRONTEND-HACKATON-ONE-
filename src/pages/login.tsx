const Login = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Iniciar Sesión</h2>
      <form>
        <input type="email" placeholder="Correo" /><br /><br />
        <input type="password" placeholder="Contraseña" /><br /><br />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
