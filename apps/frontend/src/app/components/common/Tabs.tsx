import classNames from 'classnames';
import { ReactElement, useState } from 'react';

interface TabsProps {
  children: ReactElement[];
}

interface TabProps {
  children: ReactElement;
  label: string;
}

interface TabLabelProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const Tabs = ({ children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(
    children[0].props.label ?? undefined,
  );

  const currentTabContent = () => {
    const child = children.find(child => child.props.label === activeTab).props;
    return child.children;
  };

  return (
    <div className="tabs">
      <div className="tab-header">
        <div className="tab-label-container">
          {children.map(tab => {
            const { label } = tab.props;
            return (
              <TabLabel
                isActive={activeTab === label}
                key={label}
                label={label}
                onClick={() => setActiveTab(label)}
              />
            );
          })}
        </div>
      </div>
      <div className="tab-content">{currentTabContent()}</div>
    </div>
  );
};

export const TabLabel = ({ label, onClick, isActive }: TabLabelProps) => {
  const className = classNames('tab-label', { active: isActive });

  return (
    <div className={className} onClick={onClick}>
      <div className="tab-label-content">{label}</div>
      {isActive && <div className="tab-label-ink-bar"></div>}
    </div>
  );
};

export const Tab = (props: TabProps) => {
  return <div className="tab">{props.children}</div>;
};
