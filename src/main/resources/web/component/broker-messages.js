import {PolymerElement, html} from '../node_modules/@polymer/polymer/polymer-element.js'
import {} from '@polymer/polymer/lib/elements/dom-repeat.js';
import '../node_modules/@polymer/paper-item/paper-item.js'
import '../node_modules/@polymer/paper-button/paper-button.js'
import '../node_modules/@polymer/paper-dialog/paper-dialog.js'
import '../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js'

import './broker-message.js'
import '../style/style.js'

class BrokerMessages extends PolymerElement {
    static get properties() {
        return {
            messages: {
                type: Object,
                notify: true
            },
            details: {
                type: Object,
                notify: true
            }
        }
    }

    static get template() {
        return html`
            <style include="style-element">
                :host {
                    overflow-y: scroll;
                    overflow-x: hidden;
                    position: absolute;
                    display: block;
                    top: 96px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                }

                .table:nth-child(odd) {
                    background-color: #3eb1c864;
                }
                .table:nth-child(even) {
                    background-color: #3eb1c832;
                }
                .header {
                    background-color: #3eb1c8;
                    pointer-events: none;
                }
                .table:hover {
                    background-color: #3e91a899;
                }

                .title {
                    font-weight: bold;
                    text-transform: capitalize;
                    display: block;
                    width: 100%;
                }

                .value {
                    display: block;
                    width: 100%;
                }

                .values {
                    margin-left: 32px;
                }

                .message-details {
                    display: flex;
                    flex-direction: row;
                }
            </style>

            <div class="header">
                <broker-message message="[[header]]"></broker-message>
            </div>
            <dom-repeat items="{{messages.hits}}" as="message">
                <template>
                    <div class="table">
                        <broker-message on-click="_details" message="[[message]]"></broker-message>
                    </div>
                </template>
            </dom-repeat>


            <paper-dialog id="dialog" modal>
                <h1>Message Details</h1>
                <paper-dialog-scrollable>
                    <div class="message-details">

                        <div>
                            <dom-repeat items="[[_properties(details)]]" as="prop">
                                <template>
                                    <span class="title">[[prop]]:</span>
                                </template>
                            </dom-repeat>
                        </div>

                        <div class="values">
                            <dom-repeat items="[[_properties(details)]]" as="prop">
                                <template>
                                    <span class="value">[[_getDetailProperty(prop, details)]]</span>
                                </template>
                            </dom-repeat>
                        </div>
                    </div>
                </paper-dialog-scrollable>
                <div class="buttons">
                    <paper-button dialog-dismiss>Close</paper-button>
                </div>
            </paper-dialog>
        `;
    }

    constructor() {
        super();
        this.detailprops = ['product', 'status', 'time', 'plugin', 'senderText', 'receiverText',
            'hash', 'nonce', 'gasUsed', 'difficulty'];
        this.details = {};
        this.header = {
            number: "Serial",
            time: "Time",
            senderText: "Sender",
            receiverText: "Receiver",
            product: "Topic",
            hash: "Hash"
        }
    }

    _properties(message) {
        return this.detailprops;
    }

    _getDetailProperty(property) {
        return this.details[property];
    }

    _details(e) {
        this.details = e.model.message;
        this.$.dialog.open();
    }
}

customElements.define('broker-messages', BrokerMessages);