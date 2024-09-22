"use client";

import {
  Modal,
  Box,
  IconButton,
  TextField,
} from "@mui/material/";
import Icon from "@mdi/react";
import * as notesModalSlice from "../slices/notes-modal";
import {mdiSend, mdiClose } from "@mdi/js";
import { ActionButton } from "@/lib/components/action-button";
import { NoteModel, addNote } from "../model";
import { useAppDispatch, useAppSelector } from "../reducers";
import { useState } from "react";

export const NotesModal = () => {
  const dispatch = useAppDispatch();
  const user_id = useAppSelector((state) => state.modqueue.user_id)
  const context_id = useAppSelector((state) => state.modqueue.context_id)
  const entry_id = useAppSelector((state) => state.notesModal.entry_id);
  const open = useAppSelector((state) => state.notesModal.open);
  const notes = useAppSelector((state) => state.notesModal.notes);
  const [noteText, setNoteText] = useState("")
  const handleClick = () => {
    addNote(entry_id, user_id, context_id, noteText)
    dispatch(notesModalSlice.addNoteText({author: user_id, body: noteText}))
    setNoteText("")
  }
  return (
    <Modal open={open} aria-labelledby="notes-modal">
      <div>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            display: "flex",
            width: "600px",
	    height: "600px",
            borderRadius: 2,
            flexDirection: "column",
            gap: "5px",
            padding: "10px",
          }}
        > 
	  <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} width={"100%"}>
	    <Box>{"  "}</Box>
    	    <Box sx={{fontSize: "30px"}}>Case Notes</Box>
  	    <IconButton onClick={() => dispatch(notesModalSlice.closeNotesModal())}> 
	      <Icon path={mdiClose} size={1}/>
	    </IconButton>
	  </Box>
	  <Box paddingLeft = {"30px"} paddingRight={"30px"} width={"100%"} overflow={"scroll"}>
	    {
              notes.map(
	        (note) => (
	          <NoteRenderer noteInfo={note} isAuthor={note.author == user_id} />
	        )
	      )
	    }
	  </Box>
          <Box 
	    display={"flex"} 
	    flexDirection={"row"} 
	    alignItems={"center"} 
	    justifyContent={"center"} 
	    width={"100%"} 
	    gap={2} 
	    paddingLeft={"30px"}
	    paddingRight={"30px"}
	    marginTop={"auto"}
	  >
	    <TextField fullWidth sx={{padding: "4px 4px"}} onChange={(event)=>{setNoteText(event.target.value)}} value={noteText}/>
	    <Icon path={mdiSend} size={1} onClick={handleClick}/>
	  </Box>
        </Box>
      </div>
    </Modal>
  );
};

const NoteRenderer = ( {noteInfo, isAuthor} : {noteInfo: NoteModel, isAuthor: Boolean}) => {
  return (
    <>
      { isAuthor ?
        <Box width={"40%"} marginLeft={"auto"} marginTop={"10px"}>
          <Box sx={{border: "1px solid #ccc", borderRadius: "5px", padding: "5px", backgroundColor: "#7cbdde"}}>
            {noteInfo.body}
          </Box> 
        </Box> :
        <Box width={"40%"} marginTop={"10px"}>
          <Box>{noteInfo.author}</Box>
          <Box sx={{border: "1px solid #ccc", borderRadius: "5px", padding: "5px", backgroundColor: "#e5ebee"}}>
            {noteInfo.body}
          </Box>
        </Box> 
      }
    </>
  )
}
