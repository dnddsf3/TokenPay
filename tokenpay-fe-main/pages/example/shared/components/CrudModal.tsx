import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "@roketid/windmill-react-ui";

interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
}

const CrudModal: React.FC<CrudModalProps> = ({ isOpen, onClose, title, children, onSave }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button layout="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save</Button>
      </ModalFooter>
    </Modal>
  );
};

export default CrudModal;
