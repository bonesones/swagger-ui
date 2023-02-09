"use strict";

var sqlite3 = require('sqlite3');

var _require = require('sqlite'),
    open = _require.open;

var openDb = function openDb() {
  var db;
  return regeneratorRuntime.async(function openDb$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(open({
            filename: "./db/books.db",
            driver: sqlite3.Database
          }));

        case 2:
          db = _context.sent;
          return _context.abrupt("return", db);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = {
  openDb: openDb
};