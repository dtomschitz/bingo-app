import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import Modal, { RenderModalBackdropProps } from 'react-overlays/Modal';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { IconButton } from './Button';
import { Divider } from './Divider';

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface DialogState<T = any> {
  show: boolean;
  fullscreen: boolean;
  data?: T;
  open: (data?: T) => void;
  close: () => void;
}

export interface DialogProps<T = any> extends DialogState<T> {
  children?: ReactNode;
  className?: string;
  hideTopDivider?: boolean;
  hideBottomDivider?: boolean;
  hideCloseButton?: boolean;
}

const DialogPane = (props: DivProps) => {
  return (
    <div {...props} className={`dialog-pane ${props?.className ?? ''}`}>
      <div className="dialog-container">{props.children}</div>
    </div>
  );
};

const renderBackdrop = (props: RenderModalBackdropProps) => (
  <div {...props} className="dialog-backdrop"></div>
);

export const BaseDialog = (props: DialogProps) => {
  const containerRef = document.getElementById('dialog-container');

  const dialogClassName = classNames('dialog-wrapper', {
    fullscreen: props.fullscreen,
  });

  const closeDialog = () => {
    props.close();
  };

  return (
    <Modal
      className={dialogClassName}
      container={containerRef}
      renderBackdrop={renderBackdrop}
      show={props.show}
    >
      <DialogPane className={props?.className}>
        {React.Children.map(props.children, child => {
          if (React.isValidElement(child)) {
            if (child.type === DialogHeader) {
              return (
                <>
                  <div className="dialog-header-container">
                    {React.cloneElement(child)}
                    {!props.hideCloseButton && (
                      <IconButton onClick={closeDialog} icon={faTimes} />
                    )}
                  </div>
                  {!props.hideTopDivider && <Divider />}
                </>
              );
            }

            if (child.type === DialogContent) {
              return (
                <div className="dialog-content-container">
                  {React.cloneElement(child)}
                </div>
              );
            }

            if (child.type === DialogActions) {
              return (
                <>
                  {!props.hideBottomDivider && <Divider />}
                  <div className="dialog-actions-container">
                    {React.cloneElement(child)}
                  </div>
                </>
              );
            }
          }

          return child;
        })}
      </DialogPane>
    </Modal>
  );
};

export const DialogContainer = () => {
  return <div id="dialog-container"></div>;
};

export const DialogHeader = (props: DivProps) => {
  return (
    <div className="dialog-header" {...props}>
      {props?.children}
    </div>
  );
};

export const DialogContent = (props: DivProps) => {
  return <div className="dialog-content" {...props}></div>;
};

export const DialogActions = (props: DivProps) => {
  return <div className="dialog-actions" {...props}></div>;
};
