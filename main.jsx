import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import { GameComposition, VIDEO_FPS, COUNTDOWN_DURATION, SLIDE_DURATION, TOTAL_DURATION } from "./composition.jsx";
import { Play, RotateCcw, Trophy, Skull, Download } from "lucide-react";
const App = () => {
  const playerRef = useRef(null);
  const [gameState, setGameState] = useState("menu");
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [seed, setSeed] = useState(1);
  const [resultMessage, setResultMessage] = useState("");
  const [stopFrame, setStopFrame] = useState(0);
  const isReplayPausedRef = useRef(false);
  const winSound = useRef(new Audio("sfx_win.mp3"));
  const loseSound = useRef(new Audio("sfx_lose.mp3"));
  const startGame = () => {
    const newSeed = Math.random();
    setSeed(newSeed);
    setGameState("playing");
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
    }
    setTimeout(() => {
      if (playerRef.current && playerRef.current.getCurrentFrame() === 0) {
        playerRef.current.play();
      }
    }, 100);
  };
  const handleStop = useCallback(() => {
    if (gameState !== "playing") return;
    const currentPlayer = playerRef.current;
    if (!currentPlayer) return;
    currentPlayer.pause();
    const currentFrame = currentPlayer.getCurrentFrame();
    setStopFrame(currentFrame);
    checkWinCondition(currentFrame);
  }, [gameState, seed, difficulty]);
  const checkWinCondition = (frame) => {
    const pseudoRandom = (seed * 9301 + 49297) % 233280 / 233280;
    const targetPos = 0.3 + pseudoRandom * 0.5;
    const relativeFrame = frame - COUNTDOWN_DURATION;
    if (relativeFrame < 0) {
      setResultMessage("Too Early!");
      triggerGameOver();
      return;
    }
    const maxFrames = SLIDE_DURATION / difficulty;
    const progress = relativeFrame / maxFrames;
    const targetMin = targetPos - 0.15 / 2;
    const targetMax = targetPos + 0.15 / 2;
    if (progress >= targetMin && progress <= targetMax) {
      setScore((prev) => prev + 1);
      setDifficulty((prev) => prev + 0.2);
      setResultMessage("PERFECT!");
      setGameState("won");
      winSound.current.currentTime = 0;
      winSound.current.play();
    } else {
      if (progress > 1) setResultMessage("Too Late!");
      else setResultMessage("Missed it!");
      triggerGameOver();
    }
  };
  const triggerGameOver = () => {
    setGameState("lost");
    loseSound.current.currentTime = 0;
    loseSound.current.play();
  };
  const instantReplay = () => {
    setGameState("replay");
  };
  useEffect(() => {
    let intervalId;
    let timeoutId;
    if (gameState === "replay") {
      const player = playerRef.current;
      if (player) {
        player.seekTo(0);
        player.play();
        isReplayPausedRef.current = false;
        intervalId = setInterval(() => {
          if (isReplayPausedRef.current || !player) return;
          const currentFrame = player.getCurrentFrame();
          if (currentFrame >= stopFrame) {
            player.pause();
            player.seekTo(stopFrame);
            isReplayPausedRef.current = true;
            if (resultMessage === "PERFECT!") {
              winSound.current.currentTime = 0;
              winSound.current.play().catch(() => {
              });
            } else {
              loseSound.current.currentTime = 0;
              loseSound.current.play().catch(() => {
              });
            }
            timeoutId = setTimeout(() => {
              if (gameState === "replay" && playerRef.current) {
                playerRef.current.seekTo(0);
                playerRef.current.play();
                isReplayPausedRef.current = false;
              }
            }, 2e3);
          }
        }, 30);
      }
    }
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [gameState, stopFrame, resultMessage]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        if (gameState === "menu" || gameState === "won" || gameState === "lost") {
          startGame();
        } else if (gameState === "playing") {
          handleStop();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, handleStop]);
  return /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col items-center justify-center bg-slate-950 relative", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute top-4 w-full px-6 flex justify-between z-20 pointer-events-none", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-2xl font-bold text-white retro-font text-shadow", children: "TIMING MASTER" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 185,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 text-xs", children: "Press SPACE or Click Button" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 186,
          columnNumber: 13
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 184,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-slate-400", children: "SCORE" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 189,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "text-3xl font-bold text-yellow-400 retro-font", children: score }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 190,
          columnNumber: 13
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 188,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 183,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "relative w-full max-w-[500px] aspect-[9/16] bg-black shadow-2xl rounded-xl overflow-hidden border border-slate-800", children: [
      /* @__PURE__ */ jsxDEV(
        Player,
        {
          ref: playerRef,
          component: GameComposition,
          durationInFrames: TOTAL_DURATION,
          fps: VIDEO_FPS,
          compositionWidth: 1080,
          compositionHeight: 1920,
          inputProps: { difficulty, seed },
          controls: false,
          loop: false,
          autoPlay: false,
          clickToPlay: false,
          style: { width: "100%", height: "100%" }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 196,
          columnNumber: 9
        }
      ),
      gameState === "menu" && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 animate-fade-in", children: [
        /* @__PURE__ */ jsxDEV(Trophy, { className: "w-20 h-20 text-yellow-400 mb-6" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 216,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("h1", { className: "text-4xl font-bold text-white mb-8 retro-font text-center px-4", children: "READY?" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 217,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: startGame,
            className: "bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all transform hover:scale-105 active:scale-95 retro-font",
            children: "START GAME"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 218,
            columnNumber: 17
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 215,
        columnNumber: 13
      }),
      gameState === "playing" && /* @__PURE__ */ jsxDEV(
        "button",
        {
          className: "absolute inset-0 w-full h-full z-30 cursor-crosshair active:bg-white/10 transition-colors",
          onMouseDown: handleStop,
          onTouchStart: (e) => {
            e.preventDefault();
            handleStop();
          },
          children: /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-10 left-0 right-0 text-center", children: /* @__PURE__ */ jsxDEV("div", { className: "inline-block bg-red-600 text-white px-8 py-4 rounded-lg font-black text-2xl animate-bounce shadow-lg border-2 border-red-400", children: "STOP!" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 236,
            columnNumber: 21
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 235,
            columnNumber: 17
          })
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 229,
          columnNumber: 13
        }
      ),
      gameState === "won" && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-green-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-40 animate-fade-in", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-5xl font-black text-white italic drop-shadow-lg mb-2", children: resultMessage }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 246,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "text-green-300 mb-8 font-mono", children: "Precision Strike!" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 247,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: startGame,
            className: "bg-white text-green-800 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-gray-100 transition-transform retro-font",
            children: "NEXT LEVEL"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 248,
            columnNumber: 17
          }
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-2 mt-4 items-center", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: instantReplay,
              className: "flex items-center text-white/80 hover:text-white",
              children: [
                /* @__PURE__ */ jsxDEV(RotateCcw, { className: "w-4 h-4 mr-2" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 259,
                  columnNumber: 25
                }),
                " Watch Replay"
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 255,
              columnNumber: 21
            }
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => alert("Video downloaded! (Simulated)"),
              className: "flex items-center text-white/60 hover:text-white text-sm",
              children: [
                /* @__PURE__ */ jsxDEV(Download, { className: "w-3 h-3 mr-2" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 265,
                  columnNumber: 25
                }),
                " Download Replay"
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 261,
              columnNumber: 21
            }
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 254,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 245,
        columnNumber: 13
      }),
      gameState === "lost" && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-red-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-40 animate-fade-in", children: [
        /* @__PURE__ */ jsxDEV(Skull, { className: "w-16 h-16 text-white mb-4 animate-pulse" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 274,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("h2", { className: "text-4xl font-black text-white mb-2", children: resultMessage }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 275,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "text-red-200 mb-8 font-mono", children: "Better luck next time" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 276,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4", children: /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => {
              setScore(0);
              setDifficulty(1);
              startGame();
            },
            className: "bg-white text-red-900 font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:bg-gray-100 transition-transform retro-font",
            children: "RETRY"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 279,
            columnNumber: 21
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 278,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-2 mt-6 items-center", children: /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: instantReplay,
            className: "flex items-center text-white/60 hover:text-white",
            children: [
              /* @__PURE__ */ jsxDEV(RotateCcw, { className: "w-4 h-4 mr-2" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 291,
                columnNumber: 25
              }),
              " See Where You Failed"
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 287,
            columnNumber: 21
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 286,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 273,
        columnNumber: 13
      }),
      gameState === "replay" && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 pointer-events-none z-30", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-4 left-0 right-0 text-center", children: /* @__PURE__ */ jsxDEV("span", { className: "bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-widest animate-pulse", children: "Instant Replay" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 301,
          columnNumber: 22
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 300,
          columnNumber: 18
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-10 left-0 right-0 flex justify-center pointer-events-auto", children: /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setGameState(resultMessage === "PERFECT!" ? "won" : "lost"),
            className: "bg-black/50 hover:bg-black/80 text-white px-6 py-2 rounded-full backdrop-blur-md border border-white/20",
            children: "Back to Menu"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 304,
            columnNumber: 22
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 303,
          columnNumber: 18
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 299,
        columnNumber: 14
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 195,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "mt-4 text-slate-500 text-xs max-w-[300px] text-center", children: "Difficulty increases every round. Reaction window gets faster." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 316,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 180,
    columnNumber: 5
  });
};
createRoot(document.getElementById("app")).render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 324,
  columnNumber: 51
}));
