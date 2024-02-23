interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  children: JSX.Element | JSX.Element[];
  className?: string;
}

export const Modal = (props: ModalProps) => {
  return (
    <div
      className={`${props.open ? "" : "hidden"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full flex bg-[#00000073]`}
    >
      <div
        className={`relative p-4 w-2xl max-w-full max-h-full ${props.className ?? ""}`}
      >
        <div className="relative p-8 bg-white rounded-md dark:bg-gray-700 flex flex-col items-center border border-[#d5d5d5]">
          <div className="w-full h-full overflow-scroll">{props.children}</div>
        </div>
      </div>
    </div>
  );
};
