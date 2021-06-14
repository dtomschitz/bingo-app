import { ReactNode, useState } from 'react';
import classNames from 'classnames';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        <span>{props.trigger}</span>
        <FontAwesomeIcon className="icon" icon={faAngleDown} />
      </div>
      <div className="content">{open ? props.children : undefined}</div>
    </div>
  );
};
