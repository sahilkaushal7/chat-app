import * as React from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface IBaseModal {
  renderContext: (open: () => void) => React.ReactElement;
  renderContent: (close: () => void) => React.ReactElement;
  onClose: () => void;
}

const BasicModal: React.FC<IBaseModal> = ({
  renderContext,
  renderContent,
  onClose,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  return (
    <>
      {renderContext(handleOpen)}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{renderContent(handleClose)}</Box>
      </Modal>
    </>
  );
};

export default BasicModal;
