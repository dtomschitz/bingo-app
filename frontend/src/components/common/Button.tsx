import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: any;
}

export const Button = (props: ButtonProps) => {
  const className = classNames('button', props?.className, {
    disabled: props?.disabled || false,
  });

  return (
    <button {...props} className={className}>
      {props.children}
    </button>
  );
};

export const FlatButton = (props: ButtonProps) => {
  const className = classNames('button', 'flat', props?.className, {
    disabled: props?.disabled || false,
  });

  return (
    <button {...props} className={className}>
      {props.children}
    </button>
  );
};

export const IconButton = (props: IconButtonProps) => {
  const className = classNames('icon-button', props?.className, {
    disabled: props?.disabled || false,
  });

  return (
    <button {...props} className={className}>
      <div className="icon">
        <FontAwesomeIcon icon={props.icon} />
      </div>
    </button>
  );
};
