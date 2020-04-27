import random from 'random';
import {
    gameState,
    setFallingTurtle,
    setLastExecution,
    setPaused,
    startGame,
} from './state';

import { setGridState } from './grid';
import { createFallingTurtle } from './turtles';
import { updateTurtle } from './updates';

import './index.scss';

// const keyListener = 
document.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
        const { fallingTurtle, started, gameOver, loop: { paused } } = gameState;
        const { key } = event;
        switch (key) {
            // start game
            case 'Enter':
                if (!started || gameOver) {
                    startGame();
                    window.requestAnimationFrame(loop);
                }
                break;
            case 'p':
                setPaused(!paused);
                break;
            case ' ':
                if (!fallingTurtle) {
                    break;
                }
                setFallingTurtle(updateTurtle(fallingTurtle, {
                    o: true,
                }));
                break;
            case 'ArrowLeft':
                if (!fallingTurtle) {
                    break;
                }
                setFallingTurtle(updateTurtle(fallingTurtle, {
                    x: -1,
                    y: 0,
                }));
                break;
            case 'ArrowRight':
                if (!fallingTurtle) {
                    break;
                }
                setFallingTurtle(updateTurtle(fallingTurtle, {
                    x: 1,
                    y: 0,
                }));
                break;
            case 'ArrowDown':
                if (!started || gameOver || !fallingTurtle) {
                    break;
                }
                setFallingTurtle(updateTurtle(fallingTurtle, {
                    x: 0,
                    y: 1,
                }));
                break;
        }
        event.stopPropagation();
        event.preventDefault();
        return false;
    },
);

const loop = (timestamp: number) => {
    let { fallingTurtle } = gameState;
    const {
        turtles,
        gameOver,
        loop: { paused, lastExecution },
    } = gameState;

    if (!paused && (!lastExecution || timestamp - lastExecution > 1000)) {

        let newTurtle = false;
        if (!fallingTurtle) {
            newTurtle = true;
            fallingTurtle = setFallingTurtle(createFallingTurtle());
        } else if (!fallingTurtle?.falling) {
            turtles.push(fallingTurtle);
            fallingTurtle = setFallingTurtle(undefined);
        }

        turtles.forEach((turtle, index, array) => {
            if (!turtle) {
                return;
            }
            const { orientation } = turtle;
            if (turtle.moving) {
                setGridState(turtle, true);
                array[index] = updateTurtle(turtle, {
                    x: orientation,
                });
                setGridState(array[index]);
            }
        });

        if (fallingTurtle && !newTurtle) {
            fallingTurtle = setFallingTurtle(updateTurtle(fallingTurtle, { x: 0, y: 1 }));
        }
        setLastExecution(timestamp);
    }

    if (!gameOver) {
        window.requestAnimationFrame(loop);
    }
};
