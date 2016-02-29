/* global hljs */
(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', function() {
        var cells = document.querySelectorAll('.diff tbody td');
        for (var i = 0, len = cells.length; i < len; i++) {
            hljs.highlightBlock(cells[i]);
        }
    });
})();
