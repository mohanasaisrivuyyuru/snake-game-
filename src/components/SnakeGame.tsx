import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const directionRef = useRef(direction);
  
  // Game Loop
  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        // Check Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 150); // Speed
    return () => clearInterval(interval);
  }, [isPaused, isGameOver, food]);

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && isGameOver) {
        resetGame();
        return;
      }

      if (e.key === ' ' && !isGameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (isPaused || isGameOver) return;

      const currentDir = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
      setDirection(directionRef.current);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isGameOver]);

  useEffect(() => {
    if (isGameOver) {
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [isGameOver, score, highScore]);

  const generateFood = (currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on the snake
      const onSnake = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center relative font-mono text-xl">
      {/* Score Header */}
      <div className="w-full max-w-[500px] flex justify-between border-b-4 border-[#FF00FF] pb-2 mb-4 shrink-0">
         <div>
           <div className="text-xs text-[#00FFFF] font-pixel tracking-widest">PTS_</div>
           <div className="text-3xl text-[#FF00FF] font-pixel glitch pt-2" data-text={score.toString().padStart(4, '0')}>{score.toString().padStart(4, '0')}</div>
         </div>
         <div className="text-right">
           <div className="text-xs text-[#00FFFF] font-pixel tracking-widest">MAX_</div>
           <div className="text-3xl text-[#FF00FF] font-pixel glitch pt-2" data-text={highScore.toString().padStart(4, '0')}>{highScore.toString().padStart(4, '0')}</div>
         </div>
      </div>

      {/* Game Board Container */}
      <div className="relative w-full max-w-[500px] max-h-[500px] aspect-square bg-[#000] border-4 border-[#00FFFF] shrink-0" style={{ imageRendering: 'pixelated' }}>
        {/* Draw Grid */}
        <div 
          className="absolute inset-0 grid" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            let blockClass = "border border-[#111]";
            if (isSnakeHead) blockClass = "bg-[#FF00FF] border border-[#00FFFF] z-10";
            else if (isSnake) blockClass = "bg-[#00FFFF] border border-[#FF00FF]";
            else if (isFood) blockClass = "bg-white animate-pulse border-2 border-[#FF00FF]";

            return (
              <div key={i} className={`w-full h-full ${blockClass}`} />
            );
          })}
        </div>

        {/* Overlays */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 text-center border-4 border-[#FF00FF] z-20">
            <h2 className="text-4xl text-[#FF00FF] font-pixel glitch" data-text="GAME_OVER">GAME_OVER</h2>
            <div className="text-[#00FFFF] font-mono mt-2 animate-pulse">FATAL_EXCEPTION_IN_MODULE</div>
            <button 
              onClick={resetGame}
              className="mt-6 px-4 py-3 border-4 border-[#00FFFF] bg-[#222] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black font-pixel text-xs tracking-widest shadow-[5px_5px_0px_#FF00FF]"
            >
              [ REBOOT_SYS ]
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
            <h2 className="text-3xl text-[#00FFFF] font-pixel glitch animate-pulse" data-text="SYS_HALTED">SYS_HALTED</h2>
            <button 
              onClick={() => setIsPaused(false)}
              className="mt-8 px-4 py-3 border-4 border-[#FF00FF] bg-[#222] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black font-pixel text-xs tracking-widest shadow-[5px_5px_0px_#00FFFF]"
            >
              {snake.length > 1 ? '[ CONT.EXE ]' : '[ INIT.EXE ]'}
            </button>
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="mt-8 text-[#00FFFF] font-pixel text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 text-center leading-loose">
        WASD/DIR :: MOVE_CMD <br /> SPACE :: HALT_CMD
      </div>
    </div>
  );
}
