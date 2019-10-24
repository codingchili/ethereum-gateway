import {PolymerElement, html} from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-item/paper-item.js'

import '../style/style.js'

class BrokerMessage extends PolymerElement {
    static get properties() {
        return {
            message: {
                type: Object,
                notify: true
            }
        }
    }

    static get template() {
        return html`
            <style include="style-element">
                .row {
                    display: flex;
                    justify-content: space-between;
                }
                .column {
                    margin-left: 16px;
                    margin-right: 16px;
                }
            </style>
            <paper-item class="row">
                <span class="column">[[message.number]]</span>
                <span class="column">[[_trunc(message.hash)]]</span>
                <span class="column">[[message.senderText]]</span>
                <span class="column">[[message.receiverText]]</span>
                <span class="column">[[message.product]]</span>
                <span class="column">[[message.plugin]]</span>
            <paper-item>
        `;
    }

    _trunc(text) {
        return text.substring(0, 8) + '..';
    }
}

customElements.define('broker-message', BrokerMessage);