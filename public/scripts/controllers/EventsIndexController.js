angular
  .module('tunely', [])
  .controller('EventsIndexController', EventsIndexController);

  function EventsIndexController () {
    var vm = this;
    vm.newEvent = {};

    vm.newEvent = {
        date: '12/12/17',
        minimum_level: 'B',
        status: "open"
    };
  }
