import { COLUMNS, ROWS } from './constants';
import { createElements } from './elements';
import { createGrid } from './grid';
import { GameState } from './types';

const beginGameState: GameState = {
    elements: createElements(),
    started: false,
    gameOver: false,
    grid: createGrid(COLUMNS, ROWS),
    nextTurtleId: 0,
    fallingTurtle: undefined,
    turtles: [],
    score: 0,
    stacks: 0,
    loop: {
        paused: false,
        lastExecution: 0,
    },
};

export const gameState: GameState = {
    ...beginGameState,
    turtles: [],
    loop: {
        ...beginGameState.loop,
    },
};

export const startGame = () => {
    const { gameOver } = gameState;

    if (gameOver) {
        Object.assign(gameState, {
            ...beginGameState,
            turtles: [],
            loop: {
                ...beginGameState.loop,
            },
        });
        setGameOver(false);
    }
    gameState.started = true;
};

export const setPaused = (paused: boolean) => {
    gameState.loop.paused = paused;
};

export const setGameOver = (over: boolean) => {
    const {
        elements: { gameOverLabel },
    } = gameState;
    gameState.gameOver = over;
    gameOverLabel.style.display = over ? 'block' : 'none';
};

export const setLastExecution = (lastExecution: number) => {
    gameState.loop.lastExecution = lastExecution;
};

export const setFallingTurtle = (turtle: TurtleState) => {
    // if (!turtle.falling) {
    //     return (gameState.fallingTurtle = undefined);
    // }
    return (gameState.fallingTurtle = turtle);
};

export const updateScore = (increment: number) => {
    const {
        elements: { scoreDisplay },
    } = gameState;
    gameState.score += increment;
    scoreDisplay.innerHTML = '' + gameState.score;
};

export const updateStacks = (increment: number) => {
    const {
        elements: { stacksDisplay },
    } = gameState;
    gameState.stacks += increment;
    stacksDisplay.innerHTML = '' + gameState.stacks;
};
