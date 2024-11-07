import React, { useState } from "react";
import { changePassword } from "../../firebase/auth";
import { logError } from "../../utils/errorLogger";
import { useAuth } from "../../context/authcontext/useAuth";

const ChangePassword: React.FC = () => {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePasswordChange = async () => {
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess("Password changed successfully.");
    } catch (error) {
      setError("Error changing password. Please check your inputs.");
      console.error("Error changing password:", error);
      logError(error as Error, user?.email?.replace("@formulaidiots.de", "") || "unknown", { context: "changePassword" });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title display-4">Change Password</h2>
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Current Password:</label>
            <input
              className="form-input"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <div className="form-group">
            <label className="form-label">New Password:</label>
            <input
              className="form-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password:</label>
            <input
              className="form-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <button className="login-button" onClick={handlePasswordChange}>
            Save Password
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
