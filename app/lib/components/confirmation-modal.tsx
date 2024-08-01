"use client";

import {Modal, Box} from "@mui/material/";
import Icon from "@mdi/react";
import {} from "@mdi/js";
import { ActionButton } from "@/lib/components/action-button";

export interface ModalState {
  open: Boolean;
  actionDesc: String;
  body: String;
}

export const ConfirmationModal = ({
  modalState,
  setModalState,
  actionFunction
}: { 
  modalState: ModalState,
  setModalState: (modalState: ModalState) => void
  actionFunction: () => void
}) => {
  const closeModal = () => {setModalState({...modalState, open: false})}
  return (
    <Modal
      open={modalState.open}
      aria-labelledby="action-confirmation-modal"
    > 
      <div>
        <Box 
	  sx={{
            position: "absolute",
	    top: "50%",
	    left: "50%",
            transform: 'translate(-50%, -50%)',
            backgroundColor: "white",
	    display: "flex",
	    width: "25%",
	    borderRadius: 2,
	    flexDirection: "column",
	    alignItems: "center",
	    gap: "5px", 
	    padding: "10px",
          }}
	>
          <Box sx={{fontWeight: "bold", fontSize: "20px", marginBottom: "10px"}}>{"Are you sure you want to " + modalState.actionDesc + "?"}</Box> 
          <Box>{modalState.body}</Box> 
          <Box sx={{display: "flex", flexDirection: "row", gap: "30px", marginTop: "30px"}}>
            <ActionButton
              icon={null} 
    	      label={"Yes, " + modalState.actionDesc}
  	      variant="filled"
  	      onClick={() => {actionFunction(); closeModal();}}
            />
            <ActionButton
              icon={null}
  	      label={"No, Cancel"}
	      variant="outlined"
	      onClick={closeModal}
            /> 
          </Box> 
        </Box>
      </div>
    </Modal>
  )
};
