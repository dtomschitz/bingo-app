interface DividerProps {
  vertical?: boolean;
}

const Divider = (props: DividerProps) => {
  return (
    <div
      className={`divider ${props.vertical ? 'vertical' : 'horizontal'}`}
    ></div>
  );
};

export default Divider;
