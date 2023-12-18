"use client";
import SettingsComponent from "@/components/settingsComponent/SettingsComponent";
import React, { useState } from "react";

const SettingsPage = () => {
  const [interval, setInterval] = useState("");
  const [token, setToken] = useState("");

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(token);
    alert("Token copied to clipboard");
  };

  return (
    <SettingsComponent />
  );
};

export default SettingsPage;
