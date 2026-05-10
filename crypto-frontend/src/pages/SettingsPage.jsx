import React, { useEffect, useState } from "react";
import "../styles/pages/settings.css";

function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const savedNotifications = localStorage.getItem("settingsNotifications");
    const savedDarkMode = localStorage.getItem("settingsDarkMode");
    const savedCurrency = localStorage.getItem("settingsCurrency");

    if (savedNotifications !== null) {
      setNotificationsEnabled(savedNotifications === "true");
    }

    if (savedDarkMode !== null) {
      setDarkModeEnabled(savedDarkMode === "true");
    }

    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("settingsNotifications", String(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem("settingsDarkMode", String(darkModeEnabled));
  }, [darkModeEnabled]);

  useEffect(() => {
    localStorage.setItem("settingsCurrency", currency);
  }, [currency]);

  return (
    <section className="settings-page">
      <div className="settings-card">
        <h2>Settings</h2>

        <div className="setting-row">
          <div>
            <h4>Notifications</h4>
            <p>Enable market and risk updates</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(event) => setNotificationsEnabled(event.target.checked)}
            />
            <span className="slider" />
          </label>
        </div>

        <div className="setting-row">
          <div>
            <h4>Dark Mode</h4>
            <p>Use dark interface style</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkModeEnabled}
              onChange={(event) => setDarkModeEnabled(event.target.checked)}
            />
            <span className="slider" />
          </label>
        </div>

        <div className="setting-row column">
          <div>
            <h4>Currency</h4>
            <p>Select preferred portfolio currency</p>
          </div>
          <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div className="setting-row column">
          <div>
            <h4>Password</h4>
            <p>Update your password securely</p>
          </div>
          <button className="password-btn" type="button">Change Password</button>
        </div>
      </div>
    </section>
  );
}

export default SettingsPage;
