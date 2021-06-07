import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  LegacyRef,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
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

/*export const IconButton = (props: IconButtonProps) => {
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
};*/

export const IconButton = forwardRef(
  (props: IconButtonProps, ref: LegacyRef<HTMLButtonElement>) => {
    const className = classNames('icon-button', props?.className, {
      disabled: props?.disabled || false,
    });

    return (
      <button {...props} ref={ref} className={className}>
        <div className="icon">
          <FontAwesomeIcon icon={props.icon} />
        </div>
      </button>
    );
  },
);
