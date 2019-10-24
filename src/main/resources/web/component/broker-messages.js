import {PolymerElement, html} from '../node_modules/@polymer/polymer/polymer-element.js'
import {} from '@polymer/polymer/lib/elements/dom-repeat.js';
import '../node_modules/@polymer/paper-item/paper-item.js'

import './broker-message.js'
import '../style/style.js'

class BrokerMessages extends PolymerElement {
    static get properties() {
        return {
            messages: {
                type: Object,
                notify: true
            }
        }
    }

    static get template() {
        return html`
            <style include="style-element">
                .table:nth-child(odd) {
                    background-color: #42cc0032;
                }
                .table:nth-child(even) {
                    background-color: #4200cc32;
                }
            </style>

            <dom-repeat items="{{messages.hits}}" as="message">
                <template>
                    <div class="table">
                        <broker-message message="[[message]]"></broker-message>
                    </div>
                </template>
            </dom-repeat>
        `;
    }
}

customElements.define('broker-messages', BrokerMessages);