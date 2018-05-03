import MapObject from './MapObject';

export default class State {
    private mapObjects: MapObject[];

    /**
     * addMapObject
     */
    public addMapObject(obj: MapObject) {
        this.mapObjects.push(obj);
    }

    /**
     * serialize
     */
    public serialize(): string {
        const serializedObjects = [];
        this.mapObjects.forEach((mapObject) => {
            serializedObjects.push(mapObject.serialize());
        });

        const state = {
            mapObjects: serializedObjects,
        };

        return JSON.stringify(state);
    }
}
