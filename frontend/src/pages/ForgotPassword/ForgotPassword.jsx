import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import forgetcss from "./ForgotPassword.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false); // لازم ترجع false عشان الزرار يفك
      navigate("/reset-password", { state: { email } });
    }, 500); // نص ثانية كفاية جداً كأنها محاكاة سريعة
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setApiError("");
  //   setSuccessMessage("");
  //   setLoading(true);
    

  //   try {

  //     await forgotPassword({ email });
      
  //     setSuccessMessage("Reset password OTP sent successfully to your email!");
      
  //     setTimeout(() => {
  //       navigate("/reset-password", { state: { email } });
  //     }, 2000);
  //   } catch (err) {
  //     setApiError(
  //       err.response?.data?.message || "An error occurred. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className={`container-fluid ${forgetcss.forgetContainer || ''}`}>
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className={`col-10 col-sm-8 col-md-6 col-lg-4 ${forgetcss.authCard || ''}`}>
          <h2 className="text-center mb-3 fw-bold">Forgot Password</h2>
          <p className="text-muted text-center mb-4 small">
            Enter your email address and we'll send you an OTP to reset your password.
          </p>

          {apiError && <div className="alert alert-danger py-2">{apiError}</div>}
          {successMessage && <div className="alert alert-success py-2">{successMessage}</div>}

          <form onSubmit={handleSubmit} >
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className={`btn  ${forgetcss.submitBtn}`}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <div className="text-center mt-3">
            <Link to="/login" className="text-decoration-none small ">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}