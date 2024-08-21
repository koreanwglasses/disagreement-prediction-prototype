"use client";
import { Box } from "@mui/material";
import { theme } from "../../theme";
import React, { useMemo } from "react";
import { Vega, VisualizationSpec, createClassFromSpec } from "react-vega";

export const PredictionScoresBarChart = ({
  scores,
}: {
  scores: { approve: number; remove: number; unsure: number };
}) => {
  /** Shorthand for scores as percentages */
  const s = [scores.approve * 100, scores.unsure * 100, scores.remove * 100];
  const maxWidth = "650px";
  const totalHeight = "40px";
  const barHeight = "6px";
  const barOffsetBottom = "6px";
  const tickWidth = "1.5px";
  const tickHeight = "18px";
  const labelOffsetBottom = "16px";
  const labelFontSize = "11px";
  return (
    <Box sx={{ transform: "translate(0,0)", height: totalHeight, maxWidth }}>
      {/* Bars */}
      {s[0] > 0 && (
        <Box
          position="absolute"
          left="0"
          bottom={barOffsetBottom}
          width={`${s[0]}%`}
          height={barHeight}
          bgcolor={theme.palette.accept.main}
        />
      )}
      {s[1] > 1 && (
        <Box
          position="absolute"
          left={`${s[0]}%`}
          bottom={barOffsetBottom}
          width={`${s[1]}%`}
          height={barHeight}
          bgcolor="#888"
        />
      )}
      {s[2] > 1 && (
        <Box
          position="absolute"
          left={`${s[0] + s[1]}%`}
          bottom={barOffsetBottom}
          width={`${s[2]}%`}
          height={barHeight}
          bgcolor={theme.palette.remove.main}
        />
      )}
      {/* Ticks */}
      {s[0] > 1 && (
        <Box
          position="absolute"
          left={`${s[0]}%`}
          bottom="0"
          height={tickHeight}
          borderRight={`solid ${tickWidth}`}
        />
      )}
      {s[1] > 1 && (
        <Box
          position="absolute"
          left={`${s[0] + s[1]}%`}
          bottom="0"
          height={tickHeight}
          borderRight={`solid ${tickWidth}`}
        />
      )}
      {/* Labels */}
      {s[0] > 0 && (
        <Box
          position="absolute"
          left="0"
          bottom={labelOffsetBottom}
          width={`${s[0]}%`}
          fontSize={labelFontSize}
          textAlign="center"
        >
          {s[0].toFixed(0)}% Approve
        </Box>
      )}
      {s[1] > 0 && (
        <Box
          position="absolute"
          left={`${s[0]}%`}
          bottom={labelOffsetBottom}
          width={`${s[1]}%`}
          fontSize={labelFontSize}
          textAlign="center"
        >
          {s[1].toFixed(0)}% Unsure
        </Box>
      )}
      {s[2] > 0 && (
        <Box
          position="absolute"
          left={`${s[0] + s[1]}%`}
          bottom={labelOffsetBottom}
          width={`${s[2]}%`}
          fontSize={labelFontSize}
          textAlign="center"
        >
          {s[2].toFixed(0)}% Remove
        </Box>
      )}
    </Box>
  );
};

export const PredictionScoresHistogram = ({ scores }: { scores: number[] }) => {
  const spec: VisualizationSpec = useMemo(
    () => ({
      width: 400,
      height: 100,
      data: [{ name: "scores" }],
    }),
    [],
  );

  return <Vega spec={spec} data={{ scores }} />;
};
