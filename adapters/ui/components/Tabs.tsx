import React from "react";

interface TabsProps<T extends string> {
  tabs: T[];
  activeTab: T;
  setActiveTab: (tab: T) => void;
}

const Tabs = <T extends string>({
  tabs,
  activeTab,
  setActiveTab,
}: TabsProps<T>): React.ReactElement => {
  return (
    <div className="border-b border-navy-700">
      <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${
              activeTab === tab
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors duration-200 focus:outline-none`}
            aria-current={activeTab === tab ? "page" : undefined}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
