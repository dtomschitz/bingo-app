interface CardProps {
  className?: any;
  children?: any;
  onClick?: () => void;
}

export const Card = (props: CardProps) => {
  const className = `
    card 
    ${props?.onClick ? 'clickable' : ''} 
    ${props?.className ?? ''}`;

  return <div className={className}>{props.children}</div>;
};

export const CardTitle = (props: CardProps) => {
  const className = `card-title ${props?.className ?? ''}`;
  return <div className={className}>{props.children}</div>;
};

export const CardContent = (props: CardProps) => {
  const className = `card-content ${props?.className ?? ''}`;
  return <div className={className}>{props.children}</div>;
};

export const CardActions = (props: CardProps) => {
  const className = `card-actions ${props?.className ?? ''}`;
  return <div className={className}>{props.children}</div>;
};
