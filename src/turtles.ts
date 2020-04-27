import random from 'random';
import { gameState, setGameOver } from './state';
import { TurtleState, Placement } from './types';
import { checkRowBlocked } from './checks';
import { lockTurtle } from './updates';

export const createTurtle = (state: TurtleState): TurtleState => {
    if (!state) {
        return state;
    }
    const { id, orientation = 1, size, color, row, column } = state;

    const turtle = document.createElement('div');
    turtle.id = `turtle-${id}`;
    turtle.setAttribute('row', '' + row);
    turtle.setAttribute('column', '' + column);
    turtle.setAttribute('orientation', '' + orientation);
    turtle.className = `turtle ${color} size-${size}`;

    const turtleHead = document.createElement('div');
    turtleHead.className = 'head';
    turtle.appendChild(turtleHead);

    const turtleTail = document.createElement('div');
    turtleTail.className = 'tail';
    turtle.appendChild(turtleTail);

    const newState: TurtleState = {
        ...state,
        orientation,
        element: turtle,
    };
    return newState;
};

export const createFallingTurtle = (): TurtleState => {
    const orientation = random.int(0, 1) === 0 ? -1 : 1;
    const size = random.int(1, 3);
    const row = 0;
    const column = size === 1 ? 4 : 3;
    const color = 'green';

    const turtle = createTurtle({
        falling: true,
        id: nextTurtleId,
        orientation,
        size,
        row,
        column,
        color,
    } as TurtleState);

    gameState.nextTurtleId++;
    gameState.fallingTurtle = turtle;
    gameState.elements.frame.appendChild(turtle.element);

    if (checkRowBlocked({ row, column, size } as Placement, 1)) {
        setGameOver(true);
        return lockTurtle(turtle);
    }

    return turtle;
};

export let fallingTurtle: TurtleState = undefined;
export let nextTurtleId: number = 0;
