$(document).ready(function() {
    console.log("search.js is loaded");
    $form = $("#search_form");

    //Update user profile data
    $form.on("submit", function(e) {
        e.preventDefault();
        data = $form.serializeArray();
        $.ajax({
            method: "GET",
            // data: $form.serializeArray(),
            url: "/api/events/",
            success: findEventsSuccess,
            error: findEventsError
        });
    });

    // Select an event to edit and display modal dialog box.
    $('#events').on('click', '.edit-event', function(event) {
      var $eventRow = $(event.target).closest('.event');
      var event_id = $eventRow.attr("data-event-id");
      //store the event_id for latter use
        $("#eventModal").data("event_id",{event_id: event_id});
        //use the show function in eventsController to get one event
      $.ajax({
          method: "GET",
          url: '/api/events/' + event_id,
          success: handleEditEvent,
          error: editEventError
        });
    });

    //participant selection buttons
    $("#violin1Button").on('click', function(e){
      e.preventDefault();
      //store the participant for later use
        $("#eventModal").data("participant",{participant: "violin1"});
      $.get('/api/me', function getUserData(user) {
        $.ajax({
            method: "GET",
            url: '/api/users/' + user._id,
            success: handleParticipant,
            error: getTheUserError
        });
      });

    });

    $("#violin2Button").on('click', function(e){
      e.preventDefault();
      //store the participant for latter use
        $("#eventModal").data("participant",{participant: "violin2"});
      $.get('/api/me', function getUserData(user) {
        $.ajax({
            method: "GET",
            url: '/api/users/' + user._id,
            success: handleParticipant,
            error: getTheUserError
        });
      });

    });

    $("#violaButton").on('click', function(e){
      e.preventDefault();
      //store the participant for latter use
        $("#eventModal").data("participant",{participant: "viola"});
      $.get('/api/me', function getUserData(user) {
        $.ajax({
            method: "GET",
            url: '/api/users/' + user._id,
            success: handleParticipant,
            error: getTheUserError
        });
      });

    });

    $("#celloButton").on('click', function(e){
      e.preventDefault();
      //store the participant for latter use
        $("#eventModal").data("participant",{participant: "cello"});
      $.get('/api/me', function getUserData(user) {
        $.ajax({
            method: "GET",
            url: '/api/users/' + user._id,
            success: handleParticipant,
            error: getTheUserError
        });
      });

    });

//End of document ready
});

// function renderEvent(event) {
// console.log("rendering", event)
//     var eventHtml = event_template(event);
//     $("#events").prepend(eventHtml);
// }

function findEventsSuccess(json) {
  $.get('/api/me', function getUserData(user) {
      $("#events").empty();
    json.forEach(function(event) {
      var goodLevel = (user.level>=event.minimum_level)
      var dateMatch = convertDate(event.date) === $("#search_date").val();
      var cityMatch = event._host.city === $("#query_city").val()

    if (dateMatch && cityMatch && goodLevel) {
        renderEvent(event);
      }
    });
  });
}

function findEventsError(err) {
    console.log("couldn't find any events");
}


function handleEditEvent(json) {
console.log(json);
    $('#eventModal').modal();
    $("#view_date").text(convertDate(json.date));
    $("#view_level").text(translateLevel(json.minimum_level));
    $("#violin1").text(json.violin1.name);
    $("#violin2").text(json.violin2.name);
    $("#viola").text(json.viola.name);
    $("#cello").text(json.cello.name);

}

function editEventError(err) {
    console.log("open edit event error");
}


function convertDate(ugly) {
  var month = parseInt(ugly[5] + ugly[6]);
  var day =   parseInt(ugly[8] + ugly[9]);
  var year =  ugly[0]+ugly[1]+ugly[2]+ugly[3];

  var refinedDate = month+'/'+day+'/'+year;
  return refinedDate;
}

function handleParticipant(user) {
  var data;
  switch ($("#eventModal").data("participant").participant) {
    case "violin1":
      data = {index: 0, player: user};
      break;
    case "violin2":
      data = {index: 1, player: user};
      break;
    case "viola":
      data = {index: 2, player: user};
      break;
    case "cello":
      data = {index: 3, player: user};
      break;
  }

  console.log('this is the user', user);
  $('#eventModal').modal('hide');
    event_id = $("#eventModal").data("event_id").event_id;
    console.log("this is the route",'/api/events/' + event_id)
  $.ajax({
      method: "PUT",
      url: '/api/events1/' + event_id,
      data: data,
      success: handleUpdateEvent,
      error: updateEventError
  });
  }

function getTheUserError(err) {
    console.log("couldn't find the user error");
}

function updateEventError(err) {
    console.log("couldn't update the event error");
}

function handleUpdateEvent() {
  $.ajax({
      method: "GET",
      url: "/api/events/",
      success: findEventsSuccess,
      error: findEventsError
  });


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
