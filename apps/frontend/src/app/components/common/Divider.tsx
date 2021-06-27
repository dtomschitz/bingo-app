interface DividerProps {
  vertical?: boolean;
}

export const Divider = (props: DividerProps) => {
  return (
    <div
      className={`divider ${props.vertical ? 'vertical' : 'horizontal'}`}
    ></div>
  );
};
