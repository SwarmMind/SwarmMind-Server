import Command from './Command';
import State from './State';
import World from './World';

export default class Game {
    private world: World;
    private round: number;      // could an overflow occur???

    public getRound() {
        return this.round;
    }

    /**
     * starts a new round
     */
    public newRound(commandLists: Array<Array<Command>>) {
        // this.processCommands(commands);

        this.processCommandLists(commandLists);
        this.processNPCActions();
        this.addNPC();
        this.round++;
    }

    /**
     * starts a new game
     * @param width width of new game-world
     * @param height height of new game-world
     */
    public start(width: number, height: number) {
        this.round = 0;
        this.world = new World(width, height);
        this.world.addUnit(4, 5);
        this.world.addUnit(5, 5);
        this.world.addUnit(5, 6);
    }

    /**
     * restarts the current game
     */
    public restart(width: number, height: number) {
        this.start(width, height);
    }

    /**
     * returns the state-object that represents the current game-state
     */
    public getState(): State {
        return this.world.getState();
    }

    private processCommand(command: Command) {
        const commandType = command.getType();
        const unitID = command.getUnitID();
        const direction = command.getDirection();

        const [directionX, directionY] = this.mapDirection(direction);

        if (commandType === 'move') {
            this.world.moveUnitIfPossible(unitID, directionX, directionY);
        } else if (commandType === 'shoot') {
            this.world.processShot(unitID, directionX, directionY);
        }
    }

    /**
     * Processes an List of lists of commands - one list for each unit
     * The shoots will be processed first
     * @param commandLists List of lists of commands
     */
    private processCommandLists(commandLists: Array<Array<Command>>) {
        const shootCommands: Array<Command> = [];
        const moveCommands: Array<Command> = [];

        commandLists.forEach((commandList) => {
            while (commandList.length > 0) {
                const command = commandList[0];
                const commandType = command.getType();

                if (!this.isCommandPossible(command)) {
                    commandList.splice(0, 1);
                    continue;
                }

                if (commandType === 'shoot') {
                    shootCommands.push(command);
                } else if (commandType === 'move') {
                    moveCommands.push(command);
                }
                break;
            }
        });

        this.processCommandList(shootCommands);
        this.processCommandList(moveCommands);
    }

    private processCommandList(list: Array<Command>) {
        list.forEach((command) => {
            this.processCommand(command);
        });
    }

    private mapDirection(direction: string): Array<number> {
        let directionX = 0;
        let directionY = 0;
        if (direction === 'north') { directionY = -1; }
        if (direction === 'south') { directionY = +1; }
        if (direction === 'west') { directionX = -1; }
        if (direction === 'east') { directionX = +1; }

        return [directionX, directionY];
    }

    private isCommandPossible(command: Command): boolean {
        const unitID = command.getUnitID();
        const commandType = command.getType();
        const direction = command.getDirection();

        const [directionX, directionY] = this.mapDirection(direction);

        if (commandType === 'shoot') {
            return true;
        }
        if (commandType === 'move') {
            return this.world.isMovePossible(unitID, directionX, directionY);
        }

        return false;
    }

    private processNPCActions() {
        this.world.doNPCActions();
    }

    private addNPC() {
        const direction = Math.floor((Math.random() * 4) + 1);
        const place = Math.floor((Math.random() * this.world.getSize()[0]) + 1);
        if (direction >= 1 && direction <= 4) {                                     // why the if???
            if (direction === 1) { this.world.addNPC(place - 1, 0); }
            if (direction === 3) { this.world.addNPC(place - 1, this.world.getSize()[0] - 1); }
            if (direction === 2) { this.world.addNPC(0, place - 1); }
            if (direction === 4) { this.world.addNPC(this.world.getSize()[1] - 1, place - 1); }

            return true;
        }

        return false;
    }
}
