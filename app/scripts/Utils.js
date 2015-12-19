define(['lib/knockout'], function(ko) {
  'use strict';
  function parseDepends(books) {
    var links = [];
    ko.utils.arrayForEach(books, function (node) {
      var skill_id = node.id;
      if (node.depends !== undefined) {
        ko.utils.arrayForEach(node.depends, function (id) {
          var link = {
            'source': skill_id - 1,
            'target': id - 1
          };
          links.push(link);
        });
      }
    });
    return links;
  }

  function getSkillById(books, id) {
    var result = [];
    ko.utils.arrayForEach(books, function (skill) {
      if(skill.id === id){
        result = skill;
      }
    });
    return result;
  }

  return {
    parseDepends: parseDepends,
    getSkillById: getSkillById
  };
});
