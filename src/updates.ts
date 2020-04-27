import { checkColumnBlocked, checkRowBlocked, getStack } from './checks';
import { COLUMNS, ROWS } from './constants';
import { setGridState } from './grid';
import { gameState, updateScore, updateStacks, setGameOver, setFallingTurtle } from './state';
import { TurtleMovement, TurtleState } from './types';

const scoreTurtle = (state: TurtleState): TurtleState => {
    if (!state) {
        return state;
    }
    const { isStack, turtle, under: u, bottom } = getStack(state);
    if (isStack && !turtle?.stacked) {
        [turtle, u, bottom].forEach(t => {
            if (!t) {
                return;
            }
            t.stacked = true;
            t.scored = true;
            t.moving = false;
            t.falling = false;
            if (t.element.firstElementChild) {
                t.element.firstElementChild.innerHTML = '⭐';
            }
            t.element.setAttribute('locked', 'true');
            t.element.setAttribute('stacked', 'true');
        });
        updateStacks(1);
        updateScore(10000);
        setGridState(turtle);
        return turtle;
    }
    return undefined;
};

export const lockTurtle = (state: TurtleState): TurtleState => {
    if (!state) {
        return state;
    }
    const { grid, turtles } = gameState;
    const { stacked, scored, row = 0, column = 0, size = 0 } = state;
    if (stacked) {
        return state;
    }

    const scoreState = scoreTurtle(state);
    if (scoreState) {
        turtles.push(scoreState);
        setFallingTurtle(undefined);
    
        return scoreState;
    }

    let cell: TurtleState = undefined;
    let cells: TurtleState[] = [];
    let cellSize: number = 0;

    for (let i = 0; i < size; i++) {
        cell = grid[column + i][row + 1];
        cells.push(cell);
        if (cell?.moving) {
            cell.moving = false;
        }
        cellSize = Math.max(cell?.size || 0, cellSize);
    }

    if (!scored) {
        // scoring

        // size * 50
        updateScore(size * 50);
        // on top of turtle the same size
        if (cellSize === size) {
            updateScore(100);
        }
        // on top of turtle of next larger size
        if (cellSize === cellSize + 1) {
            updateScore(500);
        }
    }

    state?.element?.setAttribute('locked', 'true');
    const newState = {
        ...state,
        scored: true,
        falling: false,
        moving: true,
    } as TurtleState;

    setGridState(newState);

    turtles.push(newState);
    setFallingTurtle(undefined);

    return newState;
};

export const spinTurtle = (state: TurtleState): TurtleState => {
    if (!(state && state.moving)) {
        return state;
    }

    const { orientation, element } = state;

    const newOrientation = orientation * -1;
    element.setAttribute('orientation', '' + newOrientation);
    return {
        ...state,
        orientation: newOrientation,
    };
};

export const updateTurtle = (
    state: TurtleState,
    move: TurtleMovement,
): TurtleState | undefined => {
    if (!state) {
        return state;
    }
    const { x = 0, y = 0, o } = move;
    const { stacked, moving = false, orientation, size, row, column, element } = state;

    let newRow = row + y;
    let newColumn = column + x;

    // can't move below the edge
    if (y && newRow > ROWS) {
        return undefined;
    }
    // can't move past the left or right edges
    if (x && (newColumn < 0 || newColumn + size - 1 > COLUMNS)) {
        return spinTurtle(state);
    }

    let newState: TurtleState = state;

    if (y) {
        const blocked = checkRowBlocked(state, y);
        if (blocked) {
            if (row === 0) {
                setGameOver(true);
            }
            return lockTurtle(state);
        }
        element.setAttribute('row', '' + newRow);
        newState = {
            ...state,
            row: newRow,
        };
        if (newRow === ROWS) {
            return lockTurtle(newState);
        }
    }
    if (x) {
        const blocked = checkColumnBlocked(state, x, moving);
        if (blocked) {
            return spinTurtle(state);
        } else {
            element.setAttribute('column', '' + newColumn);
            newState = {
                ...state,
                column: newColumn,
            };
        }
    }
    if (o) {
        const newOrientation = o ? orientation * -1 : orientation;
        element.setAttribute('orientation', '' + newOrientation);
        newState = {
            ...state,
            orientation: newOrientation,
        };
    }

    if (!stacked) {
        scoreTurtle(newState);
    }

    return newState;
};
