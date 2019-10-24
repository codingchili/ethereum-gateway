import {PolymerElement, html} from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-button/paper-button'
import '../node_modules/@polymer/paper-input/paper-input'
import '../node_modules/@polymer/paper-toast/paper-toast'
import '../node_modules/@polymer/paper-card/paper-card.js'
import '../style/style.js'

import {Beth} from '../script/beth.js'

class BrokerSearch extends PolymerElement {
	static get template() {
		return html`
		    <style include="style-element">
                #search-area {
                    margin: auto;
                    width: 60%;
                    display: block;
                }

                #search {
                    width: 100%;
                }

                #search-button {
                    margin-top: 12px;
                }

                #inner-container {
                    display: flex;
                    flex-direction: row;
                    padding: 16px;
                }

                paper-toast {
                    margin-top: 108px;
                }
		    </style>

			<paper-card id="search-area">
			    <div id="inner-container">
                    <paper-input placeholder="search" id="search" value="{{query}}" on-keydown="_enter" autofocus></paper-input>
                    <div>
                        <paper-button raised id="search-button" on-click="_search">Search</paper-button>
                    </div>
                </div>
                <paper-toast class="fit-bottom" id="feedback">[[feedback]]</paper-toast>
			</paper-card>
		`
	}

    static get properties() {
        return {
            result: {
                type: Object,
                notify: true
            }
        }
    }

    constructor() {
        super();
        this.query = "query { block(number: 1) { hash } }"
        this.history = {items: [], length: 5, index: -1};
        this.beth = new Beth();
        this.beth.connect(() => {
            console.log('search element connected');
            this.connected = true;
        });
    }

    _enter(e) {
        if (e.key === 'Enter') {
            this._search();
        }
        switch (e.key) {
            case "PageUp":
                this.history.index++;
                this._traverseHistory();
                break;
            case "PageDown":
                this.history.index--;
                this._traverseHistory();
                break;
        }
    }

    _traverseHistory() {
        if (this.history.index >= this.history.items.length || this.history.index == -1) {
            this.history.index = 0;
        }
        this.query = this.history.items[this.history.index];
    }

    _search() {
        if (this.connected) {
            this.start = performance.now();
            this.beth.query(this.query, (event) => {
                console.log(event);
                if (event.errors) {
                    this._error(event.errors[0].message)
                } else {
                    // todo support range/multiple hits
                    this.result = {
                        hits: [event],
                        time: (performance.now() - this.start).toFixed(2)
                    }
                    this._push(this.query);
                    this.query = "";
                }
            });
        } else {
            this._error('Error: not connected');
        }
    }

    _error(message) {
        this.feedback = message;
        this.$.feedback.fitInto = this.$['inner-container'];
        this.$.feedback.open();
    }

    _push(query) {
        this.history.index = -1;
        this.history.items.unshift(query);
        this.history.items = this.history.items.splice(0, this.history.length);
    }
}
customElements.define('broker-search', BrokerSearch);