const styleElement = document.createElement('dom-module');
styleElement.innerHTML =
  `<template>
    <style>
      * {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            /*opacity: 0.86;*/
      }
    </style>
  </template>`;
styleElement.register('style-element');