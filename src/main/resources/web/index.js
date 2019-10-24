import {PolymerElement, html} from './node_modules/@polymer/polymer/polymer-element.js'
import './component/broker-search.js'
import './component/broker-log.js'

class BrokerSpace extends PolymerElement {
	static get template() {
		return html`
		    <style>
		        #page {
		            margin-top: 32px;
		        }
		    </style>
		    <div id="page">
                <broker-search result="{{result}}"></broker-search>
                <broker-log messages="[[result]]"></broker-log>
            </page>
		`
	}

	constructor() {
	    super();
	    this.hits = [];
	}
}
customElements.define('broker-space', BrokerSpace);