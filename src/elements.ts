import { GameElements } from './types';

export const createElements = (): GameElements => {
    const appElement =
        document.getElementById('app') || document.createElement('div');

    const gridOutput =
        (document.querySelector('.grid-output') as HTMLElement) ||
        document.createElement('div');

    const gridSegmentOutput =
        (document.querySelector('.grid-segment-output') as HTMLElement) ||
        document.createElement('div');

    const scoreboard = document.createElement('div');
    scoreboard.id = 'scoreboard';

    const scoreLabel = document.createElement('div');
    scoreLabel.id = 'scoreLabel';
    scoreLabel.innerHTML = 'Score';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'score';
    scoreDisplay.innerHTML = '0';

    const stacksLabel = document.createElement('div');
    stacksLabel.id = 'stacksLabel';
    stacksLabel.innerHTML = 'Stacks';

    const stacksDisplay = document.createElement('div');
    stacksDisplay.id = 'stacks';
    stacksDisplay.innerHTML = '0';

    scoreboard.appendChild(scoreLabel);
    scoreboard.appendChild(scoreDisplay);
    scoreboard.appendChild(stacksLabel);
    scoreboard.appendChild(stacksDisplay);

    const gameOverLabel = document.createElement('div');
    gameOverLabel.id = 'gameOverLabel';
    gameOverLabel.innerHTML = 'Game Over';

    const frame = document.createElement('div');
    frame.id = 'frame';
    frame.appendChild(gameOverLabel);

    appElement.appendChild(scoreboard);
    appElement.appendChild(frame);

    return {
        appElement,
        frame,
        gridOutput,
        gridSegmentOutput,
        scoreDisplay,
        stacksDisplay,
        gameOverLabel,
    };
};
