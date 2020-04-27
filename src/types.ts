export interface GameState {
    started: boolean;
    gameOver: boolean;
    grid: Grid;
    nextTurtleId: number;
    fallingTurtle: TurtleState;
    turtles: TurtleState[];
    elements: GameElements;
    score: number;
    stacks: number;
    loop: GameLoop;
}

export interface GameLoop {
    paused: boolean;
    lastExecution: number;
}

export interface GameElements {
    appElement: HTMLElement;
    frame: HTMLDivElement;
    gridOutput?: HTMLElement;
    gridSegmentOutput?: HTMLElement;
    scoreDisplay: HTMLDivElement;
    stacksDisplay: HTMLDivElement;
    gameOverLabel: HTMLDivElement;
}

export type TurtleColor = 'green' | 'blue';

export interface Placement {
    row: number;
    column: number;
    size: number;
}

export interface BaseTurtleState extends Placement {
    id: number;
    falling: boolean;
    orientation: number;
    color: TurtleColor;
}

interface ITurtleState extends BaseTurtleState {
    orientation: number;
    moving?: boolean;
    scored?: boolean;
    stacked?: boolean;
    element: HTMLDivElement;
}
export type TurtleState =
    | (ITurtleState & BaseTurtleState & Placement)
    | undefined;

export interface TurtleMovement {
    x?: number;
    y?: number;
    o?: boolean;
}

export interface TurtleStack {
    isStack: boolean;
    over?: TurtleState;
    turtle: TurtleState;
    under?: TurtleState;
    bottom?: TurtleState;
}

export type GridColumn = Array<TurtleState>;
export type Grid = Array<GridColumn>;
