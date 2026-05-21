import React, { useState } from "react";

import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Sidebar from "./Sidebar/sidebar";

function DashboardLayout() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 bg-white">
        {/* Header */}
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 border border-gray-200 rounded-lg ">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
