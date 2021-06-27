import classNames from 'classnames';

interface Badge {
  text: string;
  className?: string;
}

export const Badge = (props?: Badge) => {
  const className = classNames('badge', 'green', props?.className);
  return <div className={className}>{props.text}</div>;
};
