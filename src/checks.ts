import { ROWS } from './constants';
import { getRow } from './grid';
import { Placement, TurtleState, TurtleStack } from './types';

import { gameState } from './state';

export const checkRowHasGaps = (row: TurtleState[]) => {
    return row.some((cell: TurtleState) => !cell);
};

export const getRowGapCount = (row: TurtleState[]) => {
    return row.filter((cell: TurtleState) => !cell).length;
}

export const checkRowHasThrees = (row: TurtleState[]) => {
    return row.some((cell: TurtleState) => cell?.size === 3);
}

export const checkRowCanBeCleared = (row: number) => {
    const rowState = getRow(row);
    // if the row has gaps, we can't remove it
    if (checkRowHasGaps(rowState)) {
        return false;
    }
    if (row > 0 && checkRowHasThrees(rowState)) {
        const overRowState = getRow(row - 1);
        if (!overRowState) {
            return false;
        }
        // if the row has any 3s in it, and there are 2+ gaps
        if (getRowGapCount(overRowState) > 1) {
            return false;
        }
        // if the row has any 3s in it, and the row above has no gaps
        // and there are no 2s above 3s
        if (!checkRowHasGaps(overRowState)) {
            for (let i = 0; i < rowState.length; i++) {
                const cell = rowState[i];
                if (cell?.size === 3) {
                    // check cells above for properly stacked 2s
                    
                }
            }
            return false;
        }
        return true;
    }

    const underRowState = getRow(row + 1);
    if (underRowState && underRowState.some((cell: TurtleState) => cell?.size === 3)) {
        return false;
    }
}

export const getStack = (turtle: TurtleState): TurtleStack => {
    if (!turtle) {
        return {} as TurtleStack;
    }
    const { row, column, size } = turtle;

    const { grid } = gameState;

    const over = row > 0 ? grid[column][row - 1] : undefined;
    const under = row < ROWS - 0 ? grid[column][row + 1] : undefined;
    const bottom = row < ROWS - 1 ? grid[column][row + 2] : undefined;

    let isStack = false;

    if (
        size === 1 && under?.size === 2 && bottom?.size === 3 && (
            (column === under?.column && column === bottom?.column) ||
            (under?.column === column - 1 && bottom?.column === column - 2)
        )
    ) {
        isStack = true;
    }

    return {
        isStack,
        over,
        turtle,
        under,
        bottom,
    };
};

export const checkRowBlocked = (placement: Placement, offset: number) => {
    const { grid } = gameState;
    const { row, column, size } = placement;

    let blocked = false;
    for (let i = 0; i < size; i++) {
        const cell = grid[column + i][row + offset];
        if (cell) {
            blocked = true;
            break;
        }
    }
    return blocked;
};

export const checkColumnBlocked = (
    placement: Placement,
    offset: number,
    checkUnder: boolean,
) => {
    const { grid } = gameState;
    const { row, column, size } = placement;

    const checkPosition =
        offset < 0 ? column + offset : column + offset + size - 1;
    const cell = grid[checkPosition][row];
    const under = row < ROWS ? grid[checkPosition][row + 1] : true;

    return cell || (checkUnder && !under);
};
