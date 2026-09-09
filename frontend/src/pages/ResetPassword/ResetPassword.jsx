import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import resetcss from "./ResetPassword.module.css";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword, resendOtp } = useContext(AuthContext);

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await resetPassword({ email, otp, newPassword });
      setSuccessMessage("Password reset successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setApiError("");
    setSuccessMessage("");
    setResendLoading(true);

    try {
      await resendOtp({ email });
      setSuccessMessage("Verification OTP resent successfully to your email!");
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={`container-fluid ${resetcss.resetContainer || ''}`}>
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className={`col-10 col-sm-8 col-md-6 col-lg-4 ${resetcss.authCard || ''}`}>
          <h2 className="text-center mb-3 fw-bold">Reset Password</h2>
          <p className="text-muted text-center mb-4 small">
            Please enter the OTP sent to <strong>{email || "your email"}</strong> and choose a new password.
          </p>

          {apiError && <div className="alert alert-danger py-2">{apiError}</div>}
          {successMessage && <div className="alert alert-success py-2">{successMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">OTP Code</label>
              <input
                type="text"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter 6-digit OTP"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">New Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`btn w-100 ${resetcss.submitBtn}`}
              disabled={loading}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          <div className="text-center mt-3">
            <span className="text-muted small">Didn't receive the code? </span>
            <button
              type="button"
              className="btn btn-link p-0 small text-decoration-none fw-semibold"
              onClick={handleResendOtp}
              disabled={resendLoading || !email}
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}