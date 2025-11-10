import React, { useState } from "react";
import Tabs from "./adapters/ui/components/Tabs";
import RoutesView from "./adapters/ui/views/RoutesView";
import CompareView from "./adapters/ui/views/CompareView";
import BankingView from "./adapters/ui/views/BankingView";
import PoolingView from "./adapters/ui/views/PoolingView";

type Tab = "Routes" | "Compare" | "Banking" | "Pooling";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Routes");

  const TABS: Tab[] = ["Routes", "Compare", "Banking", "Pooling"];

  const renderContent = () => {
    switch (activeTab) {
      case "Routes":
        return <RoutesView />;
      case "Compare":
        return <CompareView />;
      case "Banking":
        return <BankingView />;
      case "Pooling":
        return <PoolingView />;
      default:
        return <RoutesView />;
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-gray-200">
      <header className="bg-navy-900 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl md:text-2xl font-bold text-cyan-400">
              FuelEU Maritime Dashboard
            </h1>
          </div>
          <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
