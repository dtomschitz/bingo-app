import { CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';

interface CardProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onClick?: () => void;
}

export const Card = (props: CardProps) => {
  const className = classNames(
    'card',
    { clickable: props?.onClick },
    props?.className,
  );

  return (
    <div {...props} className={className}>
      {props.children}
    </div>
  );
};

export const CardHeader = (props: CardProps) => {
  const className = classNames('card-header', props?.className);
  return (
    <div className={className} style={props?.style}>
      {props.children}
    </div>
  );
};

export const CardTitle = (props: CardProps) => {
  const className = classNames('card-title', props?.className);
  return <div className={className}>{props.children}</div>;
};

export const CardContent = (props: CardProps) => {
  const className = classNames('card-content', props?.className);
  return <div className={className}>{props.children}</div>;
};

export const CardActions = (props: CardProps) => {
  const className = classNames('card-actions', props?.className);
  return <div className={className}>{props.children}</div>;
};
