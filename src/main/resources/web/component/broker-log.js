import {PolymerElement, html} from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-tabs/paper-tabs.js'
import '../node_modules/@polymer/iron-pages/iron-pages.js'
import '../node_modules/@polymer/paper-checkbox/paper-checkbox.js'
import '../node_modules/@polymer/paper-card/paper-card.js'

import './broker-messages.js'
import '../style/style.js'

import {Beth} from '../script/beth.js'

class BrokerLog extends PolymerElement {
    static get properties() {
        return {
            messages: {
                type: Object,
                notify: true,
                observer: '_onSearch'
            }
        }
    }

	static get template() {
		return html`
		    <style include="style-element">
		        #container {
		            display: block;
                    width: 80%;
                    margin: auto;
                    display: block;
                    position: absolute;
                    top: 164px;
                    left: 10%;
                    right: 10%;
                    bottom: 64px;
		        }

		        .stream {
		            display: block;
		            text-align: left;
		        }

		        .hits {
                    display: block;
		        }

		        .time {
		            display: block;
		        }

		        iron-pages {
		            margin-top: 12px;
		        }

		        .header {
		            display: flex;
		            flex-direction: row;
		            justify-content: space-between;
		            padding-bottom: 16px;
		            margin-left: 8px;
		            margin-right: 8px;
		        }
		    </style>

            <paper-card id="container">
                <paper-tabs selected="{{selected}}" autoselect-delay="0">
                    <paper-tab>STREAM</paper-tab>
                    <paper-tab>RESULTS</paper-tab>
                </paper-tabs>
                <iron-pages selected="{{selected}}">
                    <div>
                        <div class="header">
                             <span class="stream">Stream count [[stream.hits.length]]</span>
                             <paper-checkbox checked checked$="[[streaming]]">Streaming</paper-checkbox>
                         </div>
                         <broker-messages messages="[[stream]]"></broker-messages>
                    </div>
                    <div>
                        <div class="header">
                            <span class="hits">Search hits [[messages.hits.length]]</span>
                            <span class="time">In [[messages.time]]ms</span>
                        </div>
                        <broker-messages messages="[[messages]]"></broker-messages>
                    </div>
                </iron-pages>
            </paper-card>
		`
	}

	constructor() {
	    super();
	    this.streaming = true;
	    this.selected = 0;
	    this.stream = {
	        hits: []
	    };
	    this._listen();
	}

	_listen() {
	    this.beth = new Beth();
	    this.beth.connect(() => {
            this.beth.stream(event => {
                if (this.streaming) {
                    this.stream.hits.unshift(event);
                    this.notifySplices('stream.hits');
                }
            });
	    });
	}

	_onSearch() {
	    this.selected = 1;
	}
}
customElements.define('broker-log', BrokerLog);