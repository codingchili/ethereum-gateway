const styleElement = document.createElement('dom-module');
styleElement.innerHTML =
  `<template>
    <style>
        * {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            --iipax-color-theme: #3eb1c8;
        }

        paper-tabs {
            --paper-tabs-selection-bar-color: var(--iipax-color-theme);
        }

        paper-tab {
            --paper-tab-ink: var(--iipax-color-theme);
        }

        paper-toast {
            --paper-toast-background-color: #ff8c00;
            text-align: center;
        }

        paper-button {
            --paper-button-ink-color: var(--iipax-color-theme);
        }

        paper-checkbox {
            --paper-checkbox-checked-color: var(--iipax-color-theme);
        }

        paper-input-container, paper-input {
            --paper-input-container-focus-color: var(--iipax-color-theme);
        }

        paper-card {
            display: block;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-thumb {
          background: red;

        }

        ::-webkit-scrollbar-thumb:hover {
          background: #b30000;
        }
    </style>
  </template>`;
styleElement.register('style-element');