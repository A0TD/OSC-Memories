import React from "react";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { validateRegisterForm } from "../../utils/validation";
import regcss from "../../assets/styles/auth.module.css";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    inviteCode: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await register(formData);
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      setApiError(
        err.response?.data?.message || "An error occurred during registration",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container-fluid ${regcss.authContainer} `}>
      <div className="row justify-content-center">
        <div
          className={`col-10 col-sm-8 col-md-6 col-lg-4  ${regcss.authCard} `}
        >
          <h2 className={regcss.title}>Create Account</h2>

          {apiError && <div className="alert alert-danger">{apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className={regcss.formLabel}>Username</label>
              <input
                type="text"
                name="username"
                className={`form-control ${regcss.inputField}`}
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
              {errors.username && (
                <div className="text-danger small mt-1">{errors.username}</div>
              )}
            </div>

            <div className="mb-3">
              <label className={regcss.formLabel}>Email Address</label>
              <input
                type="email"
                name="email"
                className={`form-control ${regcss.inputField}`}
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
              <label className={regcss.formLabel}>Password</label>
              <div className={regcss.passwordGroup}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control ${regcss.inputField} ${regcss.passwordInput}`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={regcss.passwordToggleBtn}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <div className="text-danger small mt-1">{errors.password}</div>
              )}
            </div>

            <div className="mb-3">
              <label className={regcss.formLabel}>Invite Code</label>
              <input
                type="text"
                name="inviteCode"
                className={`form-control ${regcss.inputField}`}
                value={formData.inviteCode}
                onChange={handleChange}
                required
                placeholder="Enter your code"
              />
              {errors.inviteCode && (
                <div className="text-danger small mt-1">
                  {errors.inviteCode}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${regcss.submitBtn}`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="text-center mt-3">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="text-decoration-none">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
