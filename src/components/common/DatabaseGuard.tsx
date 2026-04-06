"use client";

import React, { useState } from "react";
import { useDatabase } from "@/context/DatabaseContext";
import LoginScreen from "../auth/LoginScreen";
import WelcomeScreen from "../layout/WelcomeScreen";
import PasswordSetupScreen from "../auth/PasswordSetupScreen";
import SettingsSetup from "../settings/SettingsSetup";

type SetupStep = "welcome" | "db-setup" | "settings" | "complete";

export default function DatabaseGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, dbExists } = useDatabase();
  // Initialize state. If DB doesn't exist, start at welcome.
  // If DB exists but we are technically "in setup session" (isLoggedIn is true immediately after creation),
  // we manage that via internal state if we want to force the flow.
  const [setupStep, setSetupStep] = useState<SetupStep>("welcome");
  const [isSetupSession, setIsSetupSession] = useState(false);

  if (dbExists === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        Loading...
      </div>
    );
  }

  // If database does NOT exist, we are definitely in the setup flow.
  // OR if we are in an active setup session (even if DB is created).
  if (!dbExists || isSetupSession) {
    switch (setupStep) {
      case "welcome":
        return <WelcomeScreen onStart={() => setSetupStep("db-setup")} />;
      case "db-setup":
        return (
          <PasswordSetupScreen
            onSuccess={() => {
              // Database created and logged in.
              // Mark session as active so we don't drop to standard login/app
              setIsSetupSession(true);
              setSetupStep("settings");
            }}
          />
        );
      case "settings":
        return (
          <SettingsSetup
            onComplete={() => {
              setIsSetupSession(false);
              setSetupStep("complete");
            }}
          />
        );
      default:
        // Fallback / Complete state -> Render children (the app)
        if (isLoggedIn) return <>{children}</>;
        return <LoginScreen />;
    }
  }

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
