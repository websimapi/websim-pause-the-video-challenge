import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig, Audio, staticFile } from "remotion";
const VIDEO_FPS = 60;
const COUNTDOWN_DURATION = 180;
const SLIDE_DURATION = 90;
const TOTAL_DURATION = COUNTDOWN_DURATION + SLIDE_DURATION + 30;
const CountdownNumber = ({ number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    fps,
    frame,
    config: { damping: 10, stiffness: 100 }
  });
  const opacity = interpolate(frame, [0, 40, 50], [0, 1, 0], {
    extrapolateRight: "clamp"
  });
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("div", { style: { transform: `scale(${scale})`, opacity }, children: /* @__PURE__ */ jsxDEV("h1", { className: "text-9xl font-black text-white retro-font drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]", children: number }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 27,
    columnNumber: 9
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 26,
    columnNumber: 7
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 25,
    columnNumber: 5
  });
};
const GameBar = ({ speedMultiplier = 1, targetPosition = 0.7 }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const progress = interpolate(
    frame,
    [0, SLIDE_DURATION / speedMultiplier],
    [0, 100],
    { extrapolateRight: "clamp" }
  );
  const barWidth = width * 0.8;
  const targetWidth = barWidth * 0.15;
  const targetLeft = barWidth * targetPosition - targetWidth / 2;
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { className: "flex flex-col items-center justify-center bg-slate-900", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-4xl text-white mb-20 font-bold uppercase tracking-widest animate-pulse", children: "Stop on Green!" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 54,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        style: { width: barWidth, height: 60 },
        className: "relative bg-slate-700 rounded-lg overflow-hidden border-4 border-slate-600 shadow-2xl",
        children: [
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              style: {
                left: `${targetPosition * 100}%`,
                width: "15%",
                transform: "translateX(-50%)"
              },
              className: "absolute top-0 bottom-0 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)] z-10"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 64,
              columnNumber: 9
            }
          ),
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              style: {
                left: `${progress}%`
              },
              className: "absolute top-0 bottom-0 w-4 bg-red-500 z-20 shadow-[0_0_15px_rgba(239,68,68,1)] border-r-2 border-white/50"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 74,
              columnNumber: 9
            }
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 flex justify-between px-2 opacity-20", children: [...Array(10)].map((_, i) => /* @__PURE__ */ jsxDEV("div", { className: "w-0.5 h-full bg-white" }, i, false, {
            fileName: "<stdin>",
            lineNumber: 84,
            columnNumber: 16
          })) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 82,
            columnNumber: 9
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 59,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "mt-8 text-slate-400 font-mono text-xl", children: "PRESS STOP NOW" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 89,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 53,
    columnNumber: 5
  });
};
const GameComposition = ({ difficulty = 1, seed = 123 }) => {
  const pseudoRandom = (seed * 9301 + 49297) % 233280 / 233280;
  const targetPos = 0.3 + pseudoRandom * 0.5;
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { className: "bg-black", children: [
    /* @__PURE__ */ jsxDEV(Sequence, { from: 0, durationInFrames: 60, children: [
      /* @__PURE__ */ jsxDEV(Audio, { src: staticFile("sfx_countdown.mp3") }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 107,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(CountdownNumber, { number: "3" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 108,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 106,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 60, durationInFrames: 60, children: [
      /* @__PURE__ */ jsxDEV(Audio, { src: staticFile("sfx_countdown.mp3") }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 113,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(CountdownNumber, { number: "2" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 114,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 112,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 120, durationInFrames: 60, children: [
      /* @__PURE__ */ jsxDEV(Audio, { src: staticFile("sfx_countdown.mp3"), volume: 1.5 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 119,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(CountdownNumber, { number: "1" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 120,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 118,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: COUNTDOWN_DURATION, children: /* @__PURE__ */ jsxDEV(GameBar, { speedMultiplier: difficulty, targetPosition: targetPos }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 125,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 124,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 104,
    columnNumber: 5
  });
};
export {
  COUNTDOWN_DURATION,
  GameComposition,
  SLIDE_DURATION,
  TOTAL_DURATION,
  VIDEO_FPS
};
