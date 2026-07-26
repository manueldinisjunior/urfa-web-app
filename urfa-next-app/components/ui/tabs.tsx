import React, { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabs">
      <div className="tab-list flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button flex-1 py-2 text-center ${activeTab === index ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content p-4">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;