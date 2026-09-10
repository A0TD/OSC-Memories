import React ,{ useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import verifycss from '../../assets/styles/auth.module.css';
export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendOtp } = useContext(AuthContext); 

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await verifyEmail({ email, otp });
      setSuccessMessage('Email verified successfully! Redirecting...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message || 'An error occurred during email verification'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccessMessage('');
    setResendLoading(true);

    try {
      await resendOtp({ email });
      setSuccessMessage('Verification OTP resent successfully to your email!');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to resend OTP. Please try again.'
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={`container-fluid ${verifycss.authContainer || ''}`}>
      <div className="row justify-content-center">
        <div className={`col-10 col-sm-8 col-md-6 col-lg-4  ${verifycss.authCard} `}>
          <h2 className="text-center mb-3">Verify Email Address</h2>
        <p className="text-muted text-center mb-4">
          Enter the OTP code sent to <strong>{email || "your email"}</strong>.
        </p>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {successMessage && <div className="alert alert-success py-2">{successMessage}</div>}

        <form onSubmit={handleVerify}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Verification Code (OTP)</label>
            <input
              type="text"
              className="form-control"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="e.g. 482910"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`btn w-100 ${verifycss.submitBtn} mx-0`}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
        <div className="text-center mt-2">
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