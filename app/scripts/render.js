define(['d3', 'lib/knockout', 'scripts/Utils', 'dagre-d3', 'jquery', 'lettuce', 'text!templates/description.html', 'jquery.tooltipster'],
  function (d3, ko, Utils, dagreD3, $, Lettuce, description_template) {
    'use strict';
    function renderPage(books_data, elementId) {
      function setSkillNode() {
        ko.utils.arrayForEach(books_data.books, function (book) {
          var value = book;
          value.label = book.title;
          value.height = 40;
          value.width = 200;
          value.rx = value.ry = 10;
          g.setNode(book.title, value);
        });
      }

      function setSkillEdge() {
        ko.utils.arrayForEach(books_data.books, function (book) {
          var book_id = book.id;
          if (book.depends) {
            ko.utils.arrayForEach(book.depends, function (id) {
              var dependents_name = Utils.getSkillById(books_data.books, id).title;
              var book_name = Utils.getSkillById(books_data.books, book_id).title;
              g.setEdge(dependents_name, book_name, {label: '', lineInterpolate: 'basis'});
            });
          }
        });
      }

      var lettuce = new Lettuce();
      var g = new dagreD3.graphlib.Graph().setGraph({});
      setSkillNode();
      setSkillEdge();

      var render = new dagreD3.render();
      var svg = d3.select(elementId);
      var inner = svg.append('g');

      render(inner, g);

      inner.selectAll('g.node')
        .attr('data-bind', function () {
          return 'css: { "can-add-points": canAddPoints, "has-points": hasPoints, "has-max-points": hasMaxPoints }';
        });

      /* add tips */
      inner.selectAll('g.node')
        .each(function (v, id) {
          var data = {
            id: id,
            name: v,
            description: g.node(v).description,
            books: g.node(v).books,
            links: g.node(v).links
          };
          var results = lettuce.Template.tmpl(description_template, data);

          $(this).tooltipster({
            content: $(results),
            contentAsHTML: true,
            position: 'left',
            animation: 'grow',
            interactive: true
          });
          $(this).find('rect').css('fill', '#ecf0f1');
        });

      svg.attr('height', g.graph().height + 120);
    }

    return {
      renderPage: renderPage
    };
  });
