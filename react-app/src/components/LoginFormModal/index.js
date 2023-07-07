import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal();
    }
  };

  const handleDemoLogin = async () => {
    setEmail("demo@aa.io");
    setPassword("password");
    if (email && password) {
      const data = await dispatch(login(email, password));
      if (data) {
        setErrors(data);
      } else {
        closeModal();
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <ul className="errors">
            {errors.map((error, idx) => (
              <li key={idx} onClick={(e) => setErrors([])}>
                {error}
              </li>
            ))}
          </ul>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="form-button" type="submit">
            Login
          </button>
          <button
            className="form-button"
            type="submit"
            onClick={handleDemoLogin}
          >
            Demo Login
          </button>
        </form>
        <p className="check-account">
          Don't have an account?{" "}
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </p>
      </div>
    </div>
  );
}

export default LoginFormModal;
