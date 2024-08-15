"use client";

import { Avatar, Box, Divider } from "@mui/material";
import { Icon } from "@mdi/react";
import { ButtonBase } from "@mui/material";
import { mdiClose } from "@mdi/js";
import { useAppDispatch, useAppSelector } from "../reducers";
import { setContextViewerEntry } from "../slices/context-viewer";
import { Flex, FlexCol } from "@/lib/components/styled";

export const ContextViewer = () => {
  const dispatch = useAppDispatch();
  const entry = useAppSelector((state) => state.contextViewer.entry);
  const subreddit = "r/changemyview";

  const showParent = !!entry?.parent_body;

  return (
    entry && (
      <FlexCol>
        <ButtonBase
          onClick={() => dispatch(setContextViewerEntry(null))}
          sx={{ justifyContent: "right" }}
        >
          <Icon path={mdiClose} size={1.5} color={"rgba(0,0,0,0.25)"} />
        </ButtonBase>

        <FlexCol gap={4}>
          {/* Post */}
          <FlexCol gap={1}>
            <Box
              display="flex"
              gap={1}
              color="rgba(0,0,0,0.5)"
              fontSize="0.75em"
              alignItems="end"
            >
              <Avatar
                alt={subreddit}
                src="/cmv.png"
                sx={{ width: 32, height: 32 }}
              />
              <Box>
                <Box fontWeight="bold" color="#000">
                  {subreddit}
                </Box>
                <Box>{entry.post_author_name ?? "unknown user"}</Box>
              </Box>
            </Box>
            <Box fontWeight="bold" fontSize={24}>
              {entry.title}
            </Box>
            <Box>{entry.post_body}</Box>
          </FlexCol>
          <Divider flexItem />

          {/* Parent Comment */}
          {showParent && (
            <Comment
              text={entry.parent_body}
              author={entry.parent_author_name}
              is_op={entry.parent_is_op}
            />
          )}

          {/* This Comment */}
          <Flex justifyContent="end">
            <Box sx={{ width: showParent ? "calc(100% - 40px)" : "100%" }}>
              <Comment
                text={entry.text}
                author={entry.author_name}
                is_op={entry.is_op}
                flair={entry.flair}
                highlighted
              />
            </Box>
          </Flex>
        </FlexCol>
      </FlexCol>
    )
  );
};

const Comment = ({
  text,
  author,
  is_op,
  flair,
  highlighted,
}: {
  text?: string;
  author?: string;
  is_op?: boolean | number;
  flair?: string | null;
  highlighted?: boolean;
}) => (
  <FlexCol>
    <Box display="flex" gap={1}>
      <Avatar alt={author} sx={{ width: 32, height: 32 }} />
      <FlexCol gap={1}>
        <Flex gap={1} fontWeight="bold" fontSize="0.75em">
          <Box color="#000">{author}</Box>
          {!!is_op && <Box color="#1a61cb">OP</Box>}
        </Flex>
        {flair && (
          <Box
            bgcolor="#cfcfcf"
            borderRadius={1}
            px={0.5}
            fontWeight="bold"
            fontSize="0.75em"
            alignSelf="start"
            color="rgba(0,0,0,0.5)"
          >
            {flair}
          </Box>
        )}
        <Box
          sx={
            highlighted
              ? {
                  bgcolor: "#e5ebee",
                  borderRadius: 1,
                  p: 1,
                }
              : {}
          }
        >
          {text}
        </Box>
      </FlexCol>
    </Box>
  </FlexCol>
);
