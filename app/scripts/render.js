define(['d3', 'lib/knockout', 'scripts/Utils', 'dagre-d3', 'jquery', 'lettuce', 'text!templates/description.html', 'jquery.tooltipster'],
  function (d3, ko, Utils, dagreD3, $, Lettuce, description_template) {
    'use strict';
    function renderPage(books_data, elementId) {
      function setBookNode() {
        ko.utils.arrayForEach(books_data.books, function (book) {
          var value = book;
          value.label = book.title;
          value.height = 40;
          value.width = 200;
          value.rx = value.ry = 10;
          g.setNode(book.title, value);
        });
      }

      function setBookEdge() {
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

      function writeDownloadLink(id){
        try {
          var isFileSaverSupported = !!new Blob();
        } catch (e) {
          alert("blob not supported");
        }

        var svg = document.getElementById(id);

        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(svg);

        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
          source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
          source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        var blob = new Blob([source], {type: "image/svg+xml"});
        saveAs(blob,  id + ".svg");
      }

      d3.select("#generate-" + elementId.substr(1)).on("click", function() {
        writeDownloadLink(elementId.substr(1));
      });

      var lettuce = new Lettuce();
      var g = new dagreD3.graphlib.Graph().setGraph({});
      setBookNode();
      setBookEdge();

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
            title: g.node(v).title,
            douban: g.node(v).douban,
            description: g.node(v).description
          };
          var results = lettuce.Template.tmpl(description_template, data);

          $(this).tooltipster({
            content: $(results),
            contentAsHTML: true,
            position: 'top',
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
