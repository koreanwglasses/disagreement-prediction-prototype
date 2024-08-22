"use client";
import { Box } from "@mui/material";
import { theme } from "../../theme";
import React, { useMemo } from "react";
import {
  Vega,
  VegaLite,
  VisualizationSpec,
  createClassFromSpec,
} from "react-vega";

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
          bgcolor={theme.palette.approve.main}
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

const histSpec: VisualizationSpec = {
  width: 400,
  height: 100,
  background: "transparent",
  data: { name: "scores" },
  mark: "bar",
  encoding: {
    x: {
      bin: { extent: [0, 1], step: 0.1 },
      field: "score",
      axis: {
        title: null,
        labelExpr: `
                    datum.value === 0 
                      ? 'Approve' 
                      : datum.value === 1 
                        ? 'Remove' 
                        : datum.value === 0.5 
                          ? 'Unsure' 
                          : ''
                  `,
      },
    },
    y: { aggregate: "count", axis: { title: "# of moderators" } },
    color: {
      field: "score",
      scale: {
        type: "linear",
        domain: [0, 1],
        range: [theme.palette.approve.main, "#aaa", theme.palette.remove.main],
      },
      legend: null,
    },
  },
};

const kdeSpec: VisualizationSpec = {
  width: 400,
  height: 100,
  background: "transparent",
  data: { name: "scores" },
  transform: [
    {
      density: "score",
      bandwidth: 0.05,
      extent: [0, 1],
    },
  ],
  mark: "bar",
  encoding: {
    x: {
      field: "value",
      type: "quantitative",
      scale: { domain: [0, 1] },
      axis: {
        title: null,
        labelExpr: `
          datum.value === 0
            ? 'Approve'
            : datum.value === 1
              ? 'Remove'
              : datum.value === 0.5
                ? 'Unsure'
                : ''
        `,
      },
    },
    y: {
      field: "density",
      type: "quantitative",
      axis: null,
    },
    color: {
      field: "value",
      scale: {
        type: "linear",
        domain: [0, 1],
        range: [theme.palette.approve.main, "#aaa", theme.palette.remove.main],
      },
      legend: null,
    },
  },
};

export const PredictionScoresHistogram = ({
  scores,
  mode = "kde",
}: {
  scores: number[];
  mode: "hist" | "kde";
}) => {
  const data = useMemo(
    () => ({ scores: scores.map((score) => ({ score })) }),
    [scores],
  );

  return (
    <Box>
      <VegaLite
        spec={mode === "hist" ? histSpec : kdeSpec}
        data={data}
        actions={false}
      />
    </Box>
  );
};
