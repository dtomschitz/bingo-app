import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import Modal, { ModalProps } from 'react-overlays/Modal';

export interface DialogProps extends ModalProps {}

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const DialogBackdrop = () => {
  return <div className="dialog-backdrop"></div>;
};

export const DialogContainer = () => {
  return <div id="dialog-container"></div>;
};

export const BaseDialog = (props: DialogProps) => {
  const containerRef = document.getElementById('dialog-container');
  const renderBackdrop = (props: any) => <DialogBackdrop {...props} />;

  return (
    <Modal
      className="dialog-wrapper"
      container={containerRef}
      renderBackdrop={renderBackdrop}
      {...props}
    ></Modal>
  );
};

export const DialogPane = (props: DivProps) => {
  return (
    <div {...props} className={`dialog-pane ${props?.className ?? ''}`}>
      <div className="dialog-container">{props.children}</div>
    </div>
  );
};

export const DialogHeader = (props: DivProps) => {
  return <div className="dialog-header" {...props}></div>;
};

export const DialogContent = (props: DivProps) => {
  return <div className="dialog-content" {...props}></div>;
};

export const DialogActions = (props: DivProps) => {
  return <div className="dialog-actions" {...props}></div>;
};
