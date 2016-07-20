angular
  .module('chamber-match', [])
  .controller('EventsIndexController', EventsIndexController);


  EventsIndexController.$inject = ['$http'];
  function EventsIndexController ($http) {
    var vm = this;
    vm.newEvent = {};

    vm.newEvent = {
        date: '12/12/17',
        minimum_level: 'B',
        status: "open"
    };

//     vm.events = [
//       {date: '12/12/17',
//       minimum_level: 'B',
//       status: "open"
//     },
//     {date: '12/12/17',
//     minimum_level: 'B',
//     status: "open"
//   },
//   {date: '12/12/17',
//   minimum_level: 'B',
//   status: "open"
// }]
// console.log(vm.events)


    // //retrieve all events for a user
        $http({
            method: "GET",
            url: '/api/events/',
          }).then(function successCallback(response){
              // console.log("response data", response.data)
              // vm.events = response.data
              // console.log("vm.events",vm.events)
              var eventsArray = [];
              $.get('/api/me', function getUserData(user) {
                  response.data.forEach(function(event) {
                      // console.log("event",event)
                      var checkHost = (event._host._id === user._id);
                      if (event.violin1 !== null) {
                          var checkViolin1 = (event.violin1._id === user._id);
                      } else { checkViolin1 = false}
                      if (event.violin2 !== null) {
                          var checkViolin2 = (event.violin2._id === user._id);
                      } else { checkViolin2 = false}
                      if (event.viola !== null) {
                          var checkViola = (event.viola._id === user._id);
                      } else { checkViola = false}
                      if (event.cello !== null) {
                          var checkCello = (event.cello._id === user._id);
                      } else { checkCello = false}

                      if (checkHost||checkViolin1||checkViolin2||checkViola||checkCello)  {
                        event['date'] = convertDate(event.date)
                        event['minimum_level'] = translateLevel(event.minimum_level);

                        eventsArray.push(event);

                      }


                      // console.log("vm.events", vm.events)
                  });
                  console.log("eventsArray",eventsArray)
                  vm.events = eventsArray
                  console.log("vm.events",vm.events)
                });

              },function errorCallback(response) {
            console.log('There was an error getting the data', response);
          });

    // //creates each event row separately
    function pickEvents(response) {

        var eventArray = [];
        $.get('/api/me', function getUserData(user) {
            response.forEach(function(event) {
                var checkHost = (event._host._id === user._id);
                if (event.violin1 !== null) {
                    var checkViolin1 = (event.violin1._id === user._id);
                } else { checkViolin1 = false}
                if (event.violin2 !== null) {
                    var checkViolin2 = (event.violin2._id === user._id);
                } else { checkViolin2 = false}
                if (event.viola !== null) {
                    var checkViola = (event.viola._id === user._id);
                } else { checkViola = false}
                if (event.cello !== null) {
                    var checkCello = (event.cello._id === user._id);
                } else { checkCello = false}

                if (checkHost||checkViolin1||checkViolin2||checkViola||checkCello)  {
                  event['date'] = convertDate(event.date)
                  event['minimum_level'] = translateLevel(event.minimum_level);
                  console.log("inside if", event)
                  eventArray.push(event);
                }
            });
            console.log("this is event array", eventArray)
            return eventArray

        });

    }
  }









$(document).ready(function() {
    console.log("app.js is loaded");
    $form = $("#user_profile_form");

    //initial load of index.html - get the user data and load profile page
    $.get('/api/me', function getUserData(user) {
      // console.log(user)
        $.ajax({
            method: "GET",
            url: '/api/users/' + user._id,
            success: handleGetTheUser,
            error: getTheUserError
        });
    });


    //Update user profile data
    $form.on("submit", function(e) {
        e.preventDefault();
        $.get('/api/me', function getUserData(user) {
            data = $form.serializeArray();
            $.ajax({
                method: "PUT",
                data: data,
                url: "/api/users/" + user._id,
                success: updateUserSuccess,
                error: updateUserError
            });
        });
    });


    //click the logout on the profile page
    // $('#newEventButton').on('click', function(e) {
    //   $.get('/api/me', function getUserData(user) {
    //       var url = "/logout";
    //       $.ajax({
    //           method: 'GET',
    //           data: user,
    //           url: url,
    //           success: handleLogoutSuccess,
    //       });
    //   });
    // });


    //click the new event button on the profile page
    $('#newEventButton').on('click', function(e) {
      e.preventDefault();
      $("#eventModal").data("event_id", {
          event_id: "new"
      });
      $('#eventModal').modal();
    });

    //Create new event in the modal dialog box
    $('#saveEvent').on('click', function(e) {
        e.preventDefault();
        console.log($("#eventModal").data("event_id").event_id);
        if ($("#eventModal").data("event_id").event_id === "new") {
            $.get('/api/me', function getUserData(user) {
                var url = "/api/events/" + user._id;
                $.ajax({
                    method: 'POST',
                    data: $("#newEventForm").serializeArray(),
                    url: url,
                    success: handlePostEventSuccess,
                    error: newPostEventError,
                });
            });
        } else {
            var event_id = $("#eventModal").data("event_id").event_id
            $.ajax({
                method: "PUT",
                url: '/api/events/' + event_id,
                data: $("#newEventForm").serializeArray(),
                success: handleUpdateEvent,
                error: updateEventError
            });
        }
    });


    // Select an event to edit and display modal dialog box.
    $('#events').on('click', '.edit-event', function(event) {
        $.get('/api/me', function getUserData(user) {
            var $eventRow = $(event.target).closest('.event');
            var event_id = $eventRow.attr("data-event-id");
            //store the event for latter use
            $("#eventModal").data("event_id", {
                event_id: event_id
            });
            //use the show function in eventsController to get one event
            $.ajax({
                method: "GET",
                url: '/api/events/' + event_id,
                data: $("#newEventForm").serializeArray(),
                success: handleEditEvent,
                error: editEventError
            });
        });
    });

    $('#deleteEvent').on('click', function(e) {
        e.preventDefault();
        event_id = $("#eventModal").data("event_id").event_id;
        $.ajax({
            method: "DELETE",
            url: '/api/events/' + event_id,
            success: handleUpdateEvent,
            error: deleteEventError
        });
    });

    // End of Document Ready
});



function getAllError(err) {
    console.log("get all events error");
}

function handlePostEventSuccess(json) {
    $('#eventModal').modal('hide');
    $.ajax({
        method: "GET",
        url: '/api/events',
        success: handleGetAllEvents,
        error: getAllError
    });
}

function newPostEventError(err) {
    console.log("add Event error");
}

function updateUserSuccess(json) {
    alert("User Profile Updated");
    getAllEvents();
}

function updateUserError(err) {
    console.log("update user error");
}

function loginError(err) {
    alert("User/Password not found");
}

function handleEditEvent(json) {
    console.log(json);
    $('#eventModal').modal();
    $("#edit_date").val(convertDate(json.date));
    $("#edit_min_level").val(json.minimum_level);
    $("#edit-event-title").text("Edit Event");
    $("#violin1").text(json.violin1.name);
    $("#violin2").text(json.violin2.name);
    $("#viola").text(json.viola.name);
    $("#cello").text(json.cello.name);
}

function editEventError(err) {
    console.log("open edit event error");
}

function handleGetTheUser(user) {
    $("#loaded").val(1);
    $("#profile_name").val(user[0].name);
    $("#profile_instrument").val(user[0].instrument);
    $("#profile_level").val(user[0].level);
    $("#profile_street_address").val(user[0].street_address);
    $("#profile_city").val(user[0].city);
    $("#profile_state").val(user[0].state);
    $("#profile_zip").val(user[0].zip);

}

function getTheUserError(err) {
  console.log("get the user error");
    alert("Please Log In");
}

function handleUpdateEvent(json) {
    $('#eventModal').modal('hide');
    $.ajax({
        method: "GET",
        url: '/api/events',
        success: handleGetAllEvents,
        error: getAllError
    });
}

function updateEventError(err) {
    console.log("could not update event error");
}

function deleteEventError(err) {
    console.log("could not delete event error");
}


function convertDate(ugly) {
    var month = ugly[5] + ugly[6];
    var day = ugly[8] + ugly[9];
    var year = ugly[0] + ugly[1] + ugly[2] + ugly[3];

    var refinedDate = month + '/' + day + '/' + year;
    return refinedDate;
}

//Translate level
function translateLevel(level){
switch (level) {
  case 1:
    return niceLevel = "C-";
  case 2:
    return niceLevel = "C";
  case 3:
    return niceLevel = "C+";
  case 4:
    return niceLevel = "B-";
  case 5:
    return niceLevel = "B";
  case 6:
    return niceLevel = "B+";
  case 7:
    return niceLevel = "A-";
  case 8:
    return niceLevel = "A";
  case 9:
    return niceLevel = "A+";
  case 10:
    return niceLevel = "Pro";
  }
}

function handleLogoutSuccess() {

};
