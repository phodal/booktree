define(['lib/knockout', 'scripts/Utils'], function (ko) {
  'use strict';

  var Skill = function (_e) {
    var e = _e || {};
    var self = this;

    self.id = e.id || 0;
    self.title = e.title || 'Unknown Skill';
    self.description = e.description;
    self.dependencies = ko.observableArray([]);
    self.dependents = ko.observableArray([]);
    self.stats = e.stats || [];
    self.rankDescriptions = e.rankDescriptions || [];
    self.talents = e.talents || [];

    //Computed values
    self.hasDependencies = ko.computed(function () {
      return self.dependencies().length > 0;
    });
    self.dependenciesFulfilled = ko.computed(function () {
      var result = true;
      ko.utils.arrayForEach(self.dependencies(), function (item) {
        if (!item.hasPoints()) {
          result = false;
        }
      });
      return result;
    });
    self.dependentsUsed = ko.computed(function () {
      var result = false;
      ko.utils.arrayForEach(self.dependents(), function (item) {
        if (item.hasPoints()) {
          result = true;
        }
      });
      return result;
    });
  };

  return Skill;
});


