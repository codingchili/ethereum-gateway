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
                    width: 86px;
                }
                .time {
                    width: 176px;
                    min-width: 176px;
                }
                .topic {
                    width: 126px;
                }
                @media screen (max-width: 1178px) {
                    paper-item {
                        display: none;
                    }
                }
            </style>
            <paper-item class="row">
                <span class="column hash">[[_base10(message.number)]]</span>
                <span class="column time">[[_trunc(message.time, 23)]]</span>
                <span class="column">[[message.senderText]]</span>
                <span class="column">[[message.receiverText]]</span>
                <span class="column topic">[[message.product]]</span>
                <span class="column">[[_trunc(message.hash, 8)]]..</span>
                <!--<span class="column">[[message.plugin]]</span>-->
            <paper-item>
        `;
    }

    _trunc(text, length) {
        text = text || "";
        return text.substring(0, length);
    }

    _base10(number) {
        number = number || "";
        number = number.toString()
        return number.includes('x') ? parseInt(number, 16).toString() : number;
    }
}

customElements.define('broker-message', BrokerMessage);