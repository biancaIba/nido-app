"use client";

import { useState } from "react";

import { Screen } from "@/config";
import {
  AddEditChild,
  AdminDashboard,
  ManageChildren,
  ManageClassrooms,
} from "@/components/features";

export default function AdminPage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeTab, setActiveTab] = useState<Screen>("home");

  const handleNavigate = (screen: Screen) => {
    setScreen(screen);
    if (screen === "home" || screen === "classrooms" || screen === "children") {
      setActiveTab(screen);
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return (
          <AdminDashboard onNavigate={handleNavigate} activeTab={activeTab} />
        );
      case "classrooms":
        return (
          <ManageClassrooms onNavigate={handleNavigate} activeTab={activeTab} />
        );
      case "children":
        return (
          <ManageChildren onNavigate={handleNavigate} activeTab={activeTab} />
        );
      case "add-child":
        return <AddEditChild onNavigate={handleNavigate} mode="add" />;
      case "edit-child":
        return <AddEditChild onNavigate={handleNavigate} mode="edit" />;
      default:
        return (
          <AdminDashboard onNavigate={handleNavigate} activeTab={activeTab} />
        );
    }
  };

  return <div>{renderScreen()}</div>;
}
