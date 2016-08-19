angular.module('phoodie.services', [])

  .service('mapService', function($q) {

    /*

      this.init = function() {

        var thisLat = 0;
        var thisLng = 0;

        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 6
        });


        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            thisLat = pos.lat;
            thisLng = pos.lng;

            console.log(thisLat, thisLng);


            var options = {
              center: new google.maps.LatLng(thisLat, thisLng),
              zoom: 13,
              disableDefaultUI: true    
            } 


        this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
        this.places = new google.maps.places.PlacesService(this.map);

        //console.log('test ' + pos.lat)


        })
      }
    } */
  })



.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
