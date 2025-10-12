let query;
let board;

// this takes care of displaying the coordinates the mouse is over
module.exports.coords = (function() {
  const self = {
    elements: {
      coords: $('#coords-info .coords'),
      icon: $('#coords-ico')
    },
    mouseCoords: null,
    init: function() {
      board = require('./board').board;
      query = require('./query').query;
      // self.elements.coords.hide();
      const _board = board.getRenderBoard()[0];
      _board.addEventListener('pointermove', pointerHandler, { passive: false });
      _board.addEventListener('mousemove', pointerHandler, { passive: false });
      _board.addEventListener('touchstart', touchHandler, { passive: false });
      _board.addEventListener('touchmove', touchHandler, { passive: false });
      // board.getRenderBoard().on("pointermove mousemove", function(evt) {
      // }).on("touchstart touchmove", function(evt) {
      // });

      function fadeCoords() {
        if (!self.elements.coords.is(':visible')) self.elements.coords.fadeIn(200);
      }

      function pointerHandler(evt) {
        const boardPos = board.fromScreen(evt.clientX, evt.clientY);

        self.mouseCoords = boardPos;
        self.elements.coords.text('(' + (boardPos.x) + ', ' + (boardPos.y) + ')');
        fadeCoords();
      }

      function touchHandler(evt) {
        const boardPos = board.fromScreen(evt.changedTouches[0].clientX, evt.changedTouches[0].clientY);

        self.mouseCoords = boardPos;
        self.elements.coords.text('(' + (boardPos.x) + ', ' + (boardPos.y) + ')');
        fadeCoords();
      }

      $(window).keydown((event) => {
        if (['INPUT', 'TEXTAREA'].includes(event.target.nodeName)) {
          // prevent inputs from triggering shortcuts
          return;
        }

        if (!event.ctrlKey && !event.metaKey && (event.key === 'c' || event.key === 'C' || event.keyCode === 67)) {
          self.copyCoords();
        }
      });
    },
    copyCoords: function(useHash = false) {
      if (!navigator.clipboard || !self.mouseCoords) {
        return;
      }
      const x = useHash ? query.get('x') : self.mouseCoords.x;
      const y = useHash ? query.get('y') : self.mouseCoords.y;
      const scale = useHash ? query.get('scale') : 20;
      navigator.clipboard.writeText(self.getLinkToCoords(x, y, scale));
      self.elements.coords.addClass('copyPulse');
      setTimeout(() => {
        self.elements.coords.removeClass('copyPulse');
      }, 200);
    },
    /**
     * Returns a link to the website at a specific position.
     * @param {number} x The X coordinate for the link to have.
     * @param {number} y The Y coordinate for the link to have.
     * @param {number} scale The board scale.
     */
    getLinkToCoords: (x = 0, y = 0, scale = 20) => {
      const templateConfig = ['template', 'tw', 'ox', 'oy', 'title', 'convert']
        .filter(query.has)
        .map((conf) => `${conf}=${encodeURIComponent(query.get(conf))}`)
        .join('&');
      return `${location.origin}/#x=${Math.floor(x)}&y=${Math.floor(y)}&scale=${scale}&${templateConfig}`;
    }
  };
  return {
    init: self.init,
    copyCoords: self.copyCoords,
    getLinkToCoords: self.getLinkToCoords,
    icon: self.elements.icon
  };
})();
