define(['lib/knockout', 'scripts/Book', 'jquery', 'underscore'],
  function (ko, Book, $, _) {
    'use strict';
    var Node = function (nodes) {
      var self = this;

      self.books = ko.observableArray(ko.utils.arrayMap(_.toArray(nodes), function (item) {
	      var book = new Book(item);
        return book;
      }));
    };

    return Node;
  });
