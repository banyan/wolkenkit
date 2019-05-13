'use strict';

const React = require('react');

const Symbols = function () {
  return (
    <svg style={{ display: 'none' }}>
      <symbol id='icon-close' viewBox='0 0 24 24'>
        <path d='M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z' />
      </symbol>

      <symbol id='icon-nav' viewBox='0 0 24 24'>
        <path d='M20,8H4V6h16V8z M20,11H4v2h16V11z M20,16H4v2h16V16z' />
      </symbol>

      <symbol id='icon-search' viewBox='0 0 24 24'>
        <path d='M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z' />
      </symbol>

      <symbol viewBox='0 0 24 24' id='icon-slack'>
        <path d='M13.1,9.9l1,3.1l-3.2,1.1l-1-3.1L13.1,9.9z M15.3,23C7,25.5,3.5,23.6,1,15.3C-1.5,7,0.4,3.5,8.7,1 C17-1.5,20.5,0.4,23,8.7C25.5,17,23.6,20.5,15.3,23z M19.6,12.5c-0.2-0.7-0.9-1-1.6-0.8l-1.6,0.5l-1-3.1L17,8.6 c0.7-0.2,1-0.9,0.8-1.6c-0.2-0.7-0.9-1-1.6-0.8l-1.6,0.5l-0.5-1.6c-0.2-0.7-0.9-1-1.6-0.8c-0.7,0.2-1,0.9-0.8,1.6l0.5,1.6L9.1,8.6 L8.6,7C8.4,6.4,7.6,6,7,6.2C6.3,6.4,6,7.1,6.2,7.8l0.5,1.6L5.2,9.9c-0.7,0.2-1,0.9-0.8,1.6c0.2,0.5,0.7,0.8,1.2,0.8 c0.1,0,0.3,0,0.4-0.1l1.6-0.5l1,3.1L7,15.4c-0.7,0.2-1,0.9-0.8,1.6c0.2,0.5,0.7,0.8,1.2,0.8c0.1,0,0.3,0,0.4-0.1l1.6-0.5l0.5,1.6 c0.2,0.5,0.7,0.8,1.2,0.8c0.1,0,0.3,0,0.4-0.1c0.7-0.2,1-0.9,0.8-1.6l-0.5-1.6l3.2-1.1l0.5,1.6c0.2,0.5,0.7,0.8,1.2,0.8 c0.1,0,0.3,0,0.4-0.1c0.7-0.2,1-0.9,0.8-1.6l-0.5-1.6l1.6-0.5C19.5,13.8,19.8,13.1,19.6,12.5z' />
      </symbol>

      <symbol id='icon-stackoverflow' viewBox='0 0 24 24'>
        <path d='M15 21h-10v-2h10v2zm6-11.665l-1.621-9.335-1.993.346 1.62 9.335 1.994-.346zm-5.964 6.937l-9.746-.975-.186 2.016 9.755.879.177-1.92zm.538-2.587l-9.276-2.608-.526 1.954 9.306 2.5.496-1.846zm1.204-2.413l-8.297-4.864-1.029 1.743 8.298 4.865 1.028-1.744zm1.866-1.467l-5.339-7.829-1.672 1.14 5.339 7.829 1.672-1.14zm-2.644 4.195v8h-12v-8h-2v10h16v-10h-2z' />
      </symbol>
    </svg>
  );
};

module.exports = Symbols;
