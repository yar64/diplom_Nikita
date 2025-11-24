'use client';
import { useState } from 'react';

export function Tabs({ 
  tabs, 
  defaultTab, 
  onTabChange,
  className = "",
  'data-testid': testId,
  ...props 
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div 
      className={`border-b border-gray-200 ${className}`}
      data-testid={testId}
      {...props}
    >
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            data-tab={tab.id}
            data-active={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}