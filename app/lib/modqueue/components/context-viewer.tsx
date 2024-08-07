"use client";

import { Box } from "@mui/material";
import { Icon } from "@mdi/react";
import { ButtonBase } from "@mui/material";
import { mdiClose } from "@mdi/js";
import { Entry } from "../model";

//TO-DO: better CSS
export const ContextViewer = ({
  entry,
  setContextEntry,
}: {
  entry: Entry | null;
  setContextEntry: (entry: Entry | null) => void;
}) => {
  return entry !== null ? (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      <ButtonBase onClick={() => setContextEntry(null)}>
        <Icon path={mdiClose} size={1.5} color={"rgba(0,0,0,0.25)"} />
      </ButtonBase>
      <Post
        title={entry.title}
        body={entry.post_body}
        author_name={entry.post_author_name}
      />
      {entry.parent_body ? (
        <Comment
          text={entry.parent_body}
          author={entry.parent_author_name}
          is_op={entry.parent_is_op}
        />
      ) : (
        <></>
      )}
      <Comment
        text={entry.text}
        author={entry.author_name}
        is_op={entry.is_op}
      />
    </Box>
  ) : (
    <></>
  );
};
/* <Box>
      </Box> 
    : <></> */

const Post = ({
  title,
  body,
  author_name,
}: {
  title: string;
  body: string;
  author_name?: string;
}) => {
  return (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      <Box style={{ display: "flex" }}>
        <>{title}</>
        <>{author_name}</>
      </Box>
      <>{body}</>
    </Box>
  );
};

const Comment = ({
  text,
  author,
  is_op,
}: {
  text: string;
  author?: string;
  is_op?: number | boolean;
}) => {
  return (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      <Box style={{ display: "flex" }}>
        <>{author}</>
        <>{is_op}</>
      </Box>
      <>{text}</>
    </Box>
  );
};
