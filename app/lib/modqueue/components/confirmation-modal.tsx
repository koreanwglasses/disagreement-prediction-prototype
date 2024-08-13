"use client";

import {
  Modal,
  Box,
  Checkbox,
  FormLabel,
  FormControlLabel,
} from "@mui/material/";
import Icon from "@mdi/react";
import {} from "@mdi/js";
import { ActionButton } from "@/lib/components/action-button";
import { ModalState, closeModal, setModalPreferences } from "../slices/modal";
import { useAppDispatch, useAppSelector } from "../reducers";

export const ConfirmationModal = () => {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector((state) => state.modal);
  const disabled = modalState.disabledModals[modalState.name];
  return (
    <Modal open={modalState.open} aria-labelledby="action-confirmation-modal">
      <div>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            display: "flex",
            width: "400px",
            borderRadius: 2,
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
            padding: "10px",
          }}
        >
          <Box
            sx={{ fontWeight: "bold", fontSize: "20px", marginBottom: "10px" }}
          >
            {`Are you sure you want to ${modalState.actionDesc}?`}
          </Box>
          <Box>{modalState.body}</Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  value={disabled}
                  onChange={(e, value) =>
                    dispatch(
                      setModalPreferences({
                        name: modalState.name,
                        disable: value,
                      }),
                    )
                  }
                />
              }
              label="Don't show this again"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "30px",
              mt: 1,
            }}
          >
            <ActionButton
              icon={null}
              label={"Yes, " + modalState.actionDesc}
              variant="filled"
              onClick={() => {
                modalState.actionFunction();
                dispatch(closeModal());
              }}
            />
            <ActionButton
              icon={null}
              label={"No, abort action"}
              variant="outlined"
              onClick={() => dispatch(closeModal())}
            />
          </Box>
        </Box>
      </div>
    </Modal>
  );
};
