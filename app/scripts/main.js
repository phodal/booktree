require.config({
  baseUrl: 'app',
  paths: {
    jquery: 'lib/jquery-2.1.3',
    json: 'lib/json',
    d3: 'lib/d3.min',
    'dagre-d3': 'lib/dagre-d3.min',
    text: 'lib/text',
    lettuce: 'lib/lettuce',
    'underscore': 'lib/underscore-min',
    'jquery.tooltipster': 'lib/jquery.tooltipster.min'
  },
  'shim': {
    'jquery.tooltipster': {
      deps: ['jquery']
    },
    'dagre-d3': {
      deps: ['d3']
    }
  }
});

require(['lib/knockout', 'scripts/render',
    'json!../data/example.json',
    'json!../data/example2.json',
    'json!../data/example3.json'
  ],
  function (ko, render,
            example,
            example2,
            example3) {
    'use strict';

    render.renderPage(example, '#example');
    render.renderPage(example2, '#example2');
    render.renderPage(example3, '#example3');
  });
