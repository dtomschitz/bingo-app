import classNames from 'classnames';

interface CardProps {
  className?: any;
  children?: any;
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
