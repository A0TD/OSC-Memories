import React from "react";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import logcss from "../../assets/styles/auth.module.css";
import {validateLoginForm} from "../../utils/validation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const validation = validateLoginForm(formData);
        if (!validation.isValid) {
          setErrors(validation.errors);
          return;
        }
        setErrors({});
        setLoading(true);
    setLoading(true);

    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      setApiError(
        err.response?.data?.message || "An error occurred during login",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container-fluid ${logcss.authContainer}`}>
      <div className="row justify-content-center">
        <div className={`col-10 col-sm-8 col-md-6 col-lg-4 ${logcss.authCard}`}>
          <h2 className={logcss.title}>Log In</h2>

          {apiError && <div className="alert alert-danger">{apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className={logcss.formLabel}>Email Address</label>
              <input
                type="email"
                name="email"
                className={`form-control ${logcss.inputField}`}
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="text-danger small mt-1">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label className={logcss.formLabel}>Password</label>
              <div className={logcss.passwordGroup}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control ${logcss.inputField} ${logcss.passwordInput}`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={logcss.passwordToggleBtn}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <div className="text-danger small mt-1">{errors.password}</div>
              )}
            </div>
            <div className="d-flex justify-content-end  mb-3">
              <Link
                to="/forgot-password"
                className="text-decoration-none small"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${logcss.submitBtn}`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-3">
            <span className="text-muted">Don't have an account? </span>
            <Link to="/register" className="text-decoration-none">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
