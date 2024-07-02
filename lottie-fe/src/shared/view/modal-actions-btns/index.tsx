import Icon from "@/shared/view/icon";

const ICON_SIZE = 16;

type ModalActionsProps = {
  handleOnDelete?: () => void;
  handleOnEdit: () => void;
  handleOnDownload: () => void;
};
const ModalActions = ({
  handleOnDelete,
  handleOnEdit,
  handleOnDownload,
}: ModalActionsProps) => {
  return (
    <div className="flex justify-center items-center gap-4">
      {handleOnDelete && (
        <Icon name="x" size={ICON_SIZE} onClick={handleOnDelete} />
      )}
      <Icon name="eye" size={ICON_SIZE} onClick={handleOnEdit} />
      <Icon name="download" size={ICON_SIZE} onClick={handleOnDownload} />
    </div>
  );
};

export default ModalActions;
