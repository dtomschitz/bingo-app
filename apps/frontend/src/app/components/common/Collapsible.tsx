import classNames from 'classnames';
import { ReactNode, useState } from 'react';

interface Collapsible {
  trigger: string;
  children: ReactNode;
  className?: string;
}

export const Collapsible = (props: Collapsible) => {
  const [open, setOpen] = useState(false);
  const className = classNames(
    'collapsible',
    'elevation-z4',
    props?.className,
    {
      open,
    },
  );

  const onTriggerClick = () => {
    setOpen(!open);
  };

  return (
    <div className={className}>
      <div className="header" onClick={onTriggerClick}>
        {props.trigger}
      </div>
      <div className="content">{open ? props.children : undefined}</div>
    </div>
  );
};
