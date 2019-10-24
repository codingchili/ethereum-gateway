const ENDPOINT = "ws://localhost:8080/"

export class Beth {

    /**
     * Opens a new connection to the backend that can be used
     * to stream events and send queries.
    */
    constructor() {
        this.handler = {};
        this.streaming = false;
    }

    /**
     * opens the connection to the backend.
     * @param callback invoked on connection established.
    */
    connect(callback) {
        this.connection = new WebSocket(ENDPOINT)
        this.connection.onopen = callback;
        this.connection.onmessage = (event) => {
            event = JSON.parse(event.data);
            console.log(event);
            if (this.handler[event.route]) {
                this.handler[event.route](event);
            } else {
                console.log(`Missing handler for '${event.route}'.`)
            }
        };
    }

    /**
     * Subscribes to the server stream.
    */
    stream(consumer) {
        this.streaming = true;
        this.handler['stream'] = (event) => {
            if (this.streaming) {
                consumer(event);
            }
        }
        this.handler['subscribe'] = (event) => {
            console.log('subscribed');
        }
        this._send('subscribe');
    }

    /**
     * Sends a graphql query and sets the query response handler for this connection.
     * @param graphql example {logs(filter: {fromBlock: 6625660}) { transaction { hash } }}
     * @param callback handler called for all query responses.
    */
    query(graphql, callback) {
        this.handler['query'] = callback;
        this._send('query', {query: graphql})
    }

    /**
     * Pauses the server stream.
     */
    pause() {
        this.streaming = false;
        this._send('unsubscribe');
    }

    /**
     * @param route the endpoint method to invoke in the API.
     * @param data the method parameters of the endpoint.
    */
    _send(route, data) {
        data = data || {};
        data.target = 'ethereum.broker'
        data.route = route;
        this.connection.send(JSON.stringify(data));
    }
}