define(['lib/knockout'], function(ko) {
  'use strict';
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
    getSkillById: getSkillById
  };
});
