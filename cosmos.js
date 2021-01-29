const CosmosClient = require('@azure/cosmos').CosmosClient;

const partitionkey = undefined;

class DBClient {

    constructor(client, collectionId) {
        this.client = client;
        this.collectionId = collectionId;

        this.database = null;
        this.container = null;
    }

    async init() {
        console.log("Setting up database");
        const dbResponse = await this.client.databases.createIfNotExists({
            id: 'vision-items'
        });
        this.database = dbResponse.database;
        
        console.log("Setting up container");
        const coResponse = await this.database.containers.createIfNotExists({
            id: this.collectionId
        });
        this.container = coResponse.container;
        console.log("Done");
    }

    async addItem(item) {
        console.log("Adding an item");
        item.date = Date.now();
        const { resource: doc } = await this.container.items.create(item);
        console.log("Added");
        return doc
    }

    async find(querySpec) {
        console.log('Querying for items from the database')
        if (!this.container) {
        throw new Error('Collection is not initialized.')
        }
        const { resources } = await this.container.items.query(querySpec).fetchAll()
        return resources
    }
}

module.exports = { DBClient }