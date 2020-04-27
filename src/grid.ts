import { ROWS } from './constants';
import { gameState } from './state';
import { Grid, TurtleState } from './types';

export const createGrid = (columns: number, rows: number): Grid => {
    const grid = new Array(columns + 1).fill(undefined).map(column => {
        return new Array(rows + 1).fill(undefined);
    });
    return grid;
};

export const getRow = (row: number) => {
    const { grid } = gameState;
    return grid.map((column: Array<TurtleState>) => {
        return column[row];
    });
};

// returns the outer columns of a 3 x 3 segment of the grid, 
export const getSegment = (row: number, column: number, full: boolean = true) => {
    const { grid } = gameState;
    return (full ? grid.slice(column, column + 2) : [grid[column], grid[column + 2]]).map(col => {
        return col.slice(row - 2, row).map((cell, index, array) => {
            let contained = false;
            switch (cell?.size) {
                case 3:
                    contained = index === 2 && cell.column === column;
                    break;
                case 2:
                    contained = index === 1 && (cell.column === column || cell.column === column + 1);
                    break;
                case 1:
                    contained = index === 0 && (
                        // 1 above left
                        (cell.column === column && array[1]?.column === column) ||
                        // 1 above right
                        (cell.column === column + 2 && array[1]?.column === column + 1)
                    );
                    break;
            }
            return contained ? cell : undefined;
        });
    });
};

const rowMarkers = new Array(ROWS + 1).fill(undefined).map((row, index) => {
    return index.toString(16).toUpperCase();
});

export const setGridOutput = (): void => {
    const {
        grid,
        elements: { gridOutput },
    } = gameState;
    if (!(grid && gridOutput)) {
        return;
    }
    setSegmentOutput(grid, gridOutput);
};

export const setSegmentOutput = (grid: Grid, element: HTMLElement): void => {
    let rows = 0;
    const output = grid
        .map((column: Array<TurtleState>, index: number) => {
            rows = column.length - 1;
            return (
                index +
                ' - ' +
                column.map((cell: TurtleState) => (cell ? 'X' : 'O')).join(' ')
            );
        })
        .concat(['    ' + rowMarkers.slice(0, rows + 1).join(' ')])
        .reverse();
    element.innerHTML = output.join('\n');
};

export const setGridState = (state: TurtleState, clear?: boolean): void => {
    if (!state) {
        return;
    }
    const { grid } = gameState;
    const { size, row, column } = state;
    for (let i = 0; i < size; i++) {
        grid[column + i][row] = clear ? undefined : state;
    }
    setGridOutput();
};
