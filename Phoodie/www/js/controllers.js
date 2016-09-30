angular.module('phoodie.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, mapService, $ionicPopup, $firebaseObject, $ionicModal) {

  //mapService.init();
  var map;
  var geocoder;
  var myPopup;
  var autocomplete;
  var newLocation;
  var cityCircle;
  var markers = [];

  var ref = firebase.database().ref();
  $scope.data = $firebaseObject(ref);



  $scope.testSave = function() {
    //TESTING HERE ONLY
  }


  $scope.initialize = function() {

    geocoder = new google.maps.Geocoder();


    var thisLat = 0;
    var thisLng = 0;

    /*map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 6
    });*/

    var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            // HERE IS THE GPS SHIT

            thisLat = pos.lat;
            thisLng = pos.lng;

            //thisLat = 22.2782;
            //thisLng = 114.1817;

            //console.log(thisLat, thisLng);

            
            var options = {
              center: new google.maps.LatLng(thisLat, thisLng),
              zoom: 15,
              disableDefaultUI: false    
            } 


            map = new google.maps.Map(
              document.getElementById("map"), options
              );

            cityCircle = new google.maps.Circle({
              strokeColor: '#FF0000',
              strokeOpacity: 0.1,
              strokeWeight: 0,
              fillOpacity: 0.1,
              map: map,
              center: {lat: thisLat, lng: thisLng},
              radius: 250
            })


            var restaurants = {
              location: {lat: thisLat, lng: thisLng},
              radius: '250',
              types: ['restaurant']
            }

            var service = new google.maps.places.PlacesService(map);
            var placeName = [];
            var placeLocation = [];
            var placeDetails = [];

            service.nearbySearch(restaurants, function(results, status) {

              if (status == google.maps.places.PlacesServiceStatus.OK) {
                //while(pagination.hasNextPage) {
                  //pagination.nextPage();
                  for(var i = 0; i < results.length; i++) {
                    var place = results[i];
                    console.log(place);
                    placeDetails[i] = i + ',' + place.name + ',' + place.vicinity;
                    placeName.push(place.name);
                    placeLocation.push(place.vicinity);
                  //console.log(place.name, place.vicinity);
                 // console.log(place);
                 //console.log(placeDetails[i]);

                 var marker = new google.maps.Marker({
                  map: map,
                  position: place.geometry.location
                });

                 //add marker to the markers array
                 markers.push(marker);


                 (function (marker, place) {
                  google.maps.event.addListener(marker, "click", function () {

                    firebase.database().ref('restaurants/').set({
                      restaurantID: place.id,
                    });

                    //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                    infoWindow.setContent(place.name);
                    infoWindow.open(map, marker);
                    console.log(place.id);
                    
                  });
                })(marker, place);

              }
             //}
           }
         })

            /*


            var pinColor = "76EE00";
            var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
              new google.maps.Size(21, 34),
              new google.maps.Point(0,0),
              new google.maps.Point(10, 34));

            var marker = new google.maps.Marker({
              //position: {lat: thisLat, lng: thisLng},
              map: map,
              icon: pinImage,
            }) */



            /*marker.setPlace({
              placeId: '86ceae61e4144edd24ae50a4cfca242ec6cddde5'
              location: 
            }) */



        //this.places = new google.maps.places.PlacesService(map);

        //console.log('test ' + pos.lat)



      })
        }
      }

      $scope.onPlaceChanged = function() {
        var place = autocomplete.getPlace();
        console.log(place);
      }


      $scope.initAutocomplete = function() {

        autocomplete = new google.maps.places.Autocomplete(
          (document.getElementById('autocomplete')),
          {
            types: ['establishment'],
            componentRestrictions: {country: "hk"}
          });

        autocomplete.addListener('place_changed', function() {
        //infowindow.close();
        //marker.setVisible(false);
        var place = autocomplete.getPlace();
        newLocation = place;
        //console.log(newLocation);
        /*console.log(place);
        console.log(place.id);*/

        /*
        var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      })*/

    }
    )}





        $scope.searchLocation = function() {

          $scope.initAutocomplete();
          console.log(newLocation);

          var infoWindow = new google.maps.InfoWindow({map: map});

          var newLatLng = newLocation.geometry.location;
          console.log(newLatLng);

          map.setZoom(18);
          map.setCenter(newLatLng);

          if(cityCircle != undefined) {
            cityCircle.setMap(null);
          }

          if(markers != null){
            for (var i = 0; i < markers.length; i++){
              markers[i].setMap(null);
            }
            markers = [];
          }


          cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.1,
            strokeWeight: 0,
            fillOpacity: 0.1,
            map: map,
            center: newLatLng,
            radius: 250
          })


          var restaurants = {
            location: newLatLng,
            radius: '250',
            types: ['restaurant']
          }


          var service = new google.maps.places.PlacesService(map);
          var placeName = [];
          var placeLocation = [];
          var placeDetails = [];

          service.nearbySearch(restaurants, function(results, status) {

            if (status == google.maps.places.PlacesServiceStatus.OK) {
                //while(pagination.hasNextPage) {
                  //pagination.nextPage();
                  for(var i = 0; i < results.length; i++) {
                    var place = results[i];
                    console.log(place);
                    placeDetails[i] = i + ',' + place.name + ',' + place.vicinity;
                    placeName.push(place.name);
                    placeLocation.push(place.vicinity);
                  //console.log(place.name, place.vicinity);
                 // console.log(place);
                 //console.log(placeDetails[i]);

                 var marker = new google.maps.Marker({
                  map: map,
                  position: place.geometry.location
                });

                 //add marker to the markers array
                 markers.push(marker);

                 (function (marker, place) {
                  google.maps.event.addListener(marker, "click", function () {
                    //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                    infoWindow.setContent(place.name);
                    infoWindow.open(map, marker);
                    console.log(place.id);

                    var uniqueid = place.id;

                    var getData = firebase.database().ref('restaurants/' + uniqueid).once('value', function(snapshot){
                      var restaurantResult = JSON.stringify(snapshot.val());
                      console.log(restaurantResult);

                      if (restaurantResult == 'null'){
                        console.log('NO DATA YET');
                        firebase.database().ref('restaurants/' + uniqueid).set({
                        //"UniqueID": place.id,
                        "Restaurant Name": place.name
                      });
                      } else {
                        console.log('GET DATA SUCCESS', restaurantResult);
                      }
                    });


                  });
                })(marker, place);

              }
             //}
           }
         })


          /*

          geocoder.geocode( { 'address': searchPlace}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              console.log(results[0]);

              var location = results[0].geometry.location;
              console.log(location);

              map.setZoom(15);
              map.setCenter(location);

              var cityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.1,
                strokeWeight: 0,
                fillOpacity: 0.1,
                map: map,
                center: location,
                radius: 500
              })


              var restaurants = {
                location: location,
                radius: '500',
                types: ['restaurant']
              }





              var service = new google.maps.places.PlacesService(map);

              service.nearbySearch(restaurants, function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {

                  var amount = 0;
                  for(var i = 0; i < results.length; i++) {
                    var place = results[i];
                  //console.log(place.name, place.vicinity);
                  console.log(place);

                  var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                  });

                  amount++;
                  console.log(amount);
                }
              }
            })


              var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
              }); 
            }
          })

          //var center = results[0].geometry.location;
          //map.panTo(center); */


        }

        $scope.locationPopUp = function() {

          $scope.data = {};

          console.log('in popup');
          myPopup = $ionicPopup.show({
            title: 'Choose your location',
            template: '<ion-list><ion-item ng-click="sortLocation(1)">Central and Western</ion-item>'+
            '<ion-item ng-click="sortLocation(2)">Wan Chai</ion-item>'+
            '<ion-item ng-click="sortLocation(3)">Eastern</ion-item>'+
            '<ion-item ng-click="sortLocation(4)">Southern</ion-item>'+
            '<ion-item ng-click="sortLocation(5)">Yau Tsim Mong</ion-item>'+
            '<ion-item ng-click="sortLocation(6)">Kowloon City</ion-item>'+
            '<ion-item ng-click="sortLocation(7)">Sham Shui Po</ion-item>'+
            '<ion-item ng-click="sortLocation(8)">Wong Tai Sin</ion-item>'+
            '<ion-item ng-click="sortLocation(9)">Kwun Tong</ion-item>'+
            '<ion-item ng-click="sortLocation(10)">Sai Kung</ion-item>'+
            '<ion-item ng-click="sortLocation(11)">Shatin</ion-item>'+
            '<ion-item ng-click="sortLocation(12)">Kwai Chung</ion-item>'+
            '<ion-item ng-click="sortLocation(13)">Tsuen Wan</ion-item>'+
            '<ion-item ng-click="sortLocation(14)">Tai Po</ion-item>'+
            '<ion-item ng-click="sortLocation(15)">Tuen Mun</ion-item>'+
            '<ion-item ng-click="sortLocation(16)">North</ion-item>'+
            '<ion-item ng-click="sortLocation(17)">Yuen Long</ion-item>'+
            '<ion-item ng-click="sortLocation(18)">Islands</ion-item></ion-list>',
            scope: $scope,
            buttons: [
            {text: 'Cancel'},
            ]
          })
        }

        $scope.sortLocation = function(args) {
          console.log(args);

          myPopup.close();

          var district;

          switch(args) {
            case 1:
            district = 'Hollywood Road Hong Kong';
            break;
            case 2:
            district = 'Wan Chai Hong Kong';
            break;
            case 3:
            district = 'Tai Koo Shing Hong Kong';
            break;
            case 4: 
            district = 'Stanley Hong Kong';
            break;
            case 5:
            district = 'Tsim Sha Tsui Hong Kong';
            break;
            case 6:
            district = 'Kowloon City Hong Kong';
            break;
            case 7:
            district = 'Sham Shui Po Hong Kong';
            break;
            case 8:
            district = 'Chuk Un Hong Kong';
            break;
            case 9:
            district = 'Kwun Tong Hong Kong';
            break;
            case 10:
            district = 'Sai Kung Hong Kong';
            break;
            case 11:
            district = 'Shatin Hong Kong';
            break;
            case 12:
            district = 'Kwai Chung Hong Kong';
            break;
            case 13:
            district = 'Tsuen Wan Hong Kong';
            break;
            case 14:
            district = 'Tai Po Hong Kong';
            break;
            case 15:
            district = 'Tuen Mun Hong Kong';
            break;
            case 16: 
            district = 'Sheung Shui Hong Kong';
            break;
            case 17:
            district = 'Yuen Long Hong Kong';
            break;
            case 18:
            district = 'Tung Chung Hong Kong';
            break;
            default:
            district = 'Central Hong Kong';
          }

          geocoder.geocode( { 'address': district}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              console.log(results[0]);

              var location = results[0].geometry.location;

              map.setZoom(14);
              map.setCenter(results[0].geometry.location);
          /*var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          }); */
        }
      })

        }


        $scope.testing = function() {

          var myLatLng = {lat: 22.3864207, lng: 114.2093172};

          var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Hello World!'
          });
        }


        $scope.getUser() = function() {
          var user = firebase.auth().currentUser;
          console.log(user);
        }



        // Open the login modal
        /*$scope.loginPopUp = function() {
          $scope.data = {};
          var loginPopup = $ionicPopup.show({
          templateUrl: 'templates/login.html',
          title: 'Sign In',
          buttons: [
             { text: '', type: 'close-popup ion-ios-close-outline' }
             ] */

          /*buttons: [
                {
                    text: 'Cancel'
                }, {
                  text: '<b>Login</b>',
                  type: 'button-positive',
                  onTap: function(e){
                    if (!$scope.email){
                      e.preventDefault();
                    } else {
                      console.log('hello');
                    }
                    
                  }                
                }] */
         /*
          });
        }; */

      })


.controller('PhotoCtrl', function($scope, $cordovaCamera, $firebaseObject) {

  var ref = firebase.database().ref();
  $scope.data = $firebaseObject(ref);


  $scope.takePhoto = function() {
    console.log('photo button clicked');

    var options = {
                    //quality: 100,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 1024,
                    targetHeight: 768,
                    quality: 100,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: true
                  };

                  $cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.imgURI = "data:image/jpeg;base64," + imageData;
                  }, function (err) {
                        // An error occured. Show a message to the user
                      });
                }

              })



.controller('UserCtrl', function($scope, $firebaseObject, $ionicPopup, $window){
  var ref = firebase.database().ref();
  $scope.data = $firebaseObject(ref);
  var userEmail;
  var user;
  var loggedIn = 0;


  $scope.loginPopUp = function() {
    $scope.data = {};
    loginPopup = $ionicPopup.show({
      templateUrl: 'templates/login.html',
      title: 'Sign In',
      buttons: [
      { text: '', type: 'close-popup ion-ios-close-outline' }
      ]

          /*buttons: [
                {
                    text: 'Cancel'
                }, {
                  text: '<b>Login</b>',
                  type: 'button-positive',
                  onTap: function(e){
                    if (!$scope.email){
                      e.preventDefault();
                    } else {
                      console.log('hello');
                    }
                    
                  }                
                }] */

              });
  };


  $scope.doLogin = function(email, password){
    console.log(email);
    console.log(password);
    
    firebase.auth().signInWithEmailAndPassword(email,password).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    })
    console.log('before login status');
    $scope.loginStatus();

    //$scope.testing();

    /*firebase.auth().onAuthStateChanged(function(user){
      if(user){
        // user signed in
        console.log('user signed in successfully');
        console.log(user.email);
        userEmail = user.email;
        $scope.testing();
      } else {
        // no user signed in
        console.log('error user not signed in');
      }
    }) */

    /*loginPopup.close();
        var loginSuccessPopup = $ionicPopup.alert({
          title: 'Login Successful!',
          template: 'Welcome, ' + userEmail
        });*/

    /*
    var user = firebase.auth().currentUser;
    console.log(user); */

  }


  $scope.loginStatus = function(){
    console.log('in login status');
    firebase.auth().onAuthStateChanged(function(user){
      if(loggedIn == 0) {
        console.log('checked logged in');
        if(user){
        // user signed in
        console.log('user signed in successfully');
        console.log(user.email);
        userEmail = user.email;
        console.log(loggedIn);
        loggedIn = 1;
        console.log(loggedIn);
        $scope.afterLoginPopup();
      } else {
        // no user signed in

        console.log('error user not signed in');
      }

    }

  })
    
  }


  $scope.afterLoginPopup = function(){
    console.log('after popup loggedin ' + loggedIn);
    loginPopup.close();

    var loginSuccessPopup = $ionicPopup.alert({
      title: 'Login Successful!',
      template: 'Welcome, ' + userEmail
    })

  }


    $scope.accountButton = function(){

      var user = firebase.auth().currentUser;
      console.log(user);
      if(user == null){
       $scope.loginPopUp();

      } else {
        $window.location.href = '#/tab/account';
      }
   }

  /*
  $scope.testing = function(){
    console.log('nginit works');
    var user = firebase.auth().currentUser;
    console.log(user);


    if (user != null) {
      console.log(user.email);
      console.log('user signed in successfully');
      loginPopup.close();
      var loginSuccessPopup = $ionicPopup.alert({
        title: 'Login Successful!',
        template: 'Welcome'
      });
    }
  } */

  $scope.doLogout = function(){
    firebase.auth().signOut().then(function(){
      console.log('Successfully signed out');
      loggedIn = 0;
    }, function(error){
      console.log('error happened');
    })
  }

  $scope.createAccount = function(email,password){
    console.log(email);
    console.log(password);

    firebase.auth().createUserWithEmailAndPassword(email,password).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
    })
  }
})

.controller('UploadCtrl', function($scope, $firebaseObject, $cordovaImagePicker, $cordovaFile) {

/*

  $scope.doGetImage = function() {
    var options = {
      maximumImagesCount: 1, //only pick 1 image
      width: 800,
      height: 800,
      quality: 80
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        console.log('Image URI: ' + results[0]);

        //confirm we are getting image back
        alert(results[0]);

        //read the image into an array buffer
        //from ngcordova/plugins/file documentation
        var fileName = results[0].replace(/^.*[\\\/]/, '');

        $cordovaFile.readAsText(cordova.file.tempDirectory, fileName)
          .then(function (success) {
            //success - get blob data
            var imageBlob = new Blob([success], {type: "image/jpeg"});

            saveToFirebase(imageBlob, fileName, function(_response){
                if(_response) {
                  alert(_response.downloadURL);
                }
            });


          }, function(error) {
            //error
          });


      }, function (error) {
        // error getting photos
      });
  }



    // from firebase/storage/web/upload-files

    function saveToFirebase(_imageBlob, _filename, _callback) {

      var storageRef = firebase.storage().ref();


      // pass in the _filename, and save the _imageblob
      var uploadTask = storageRef.child('images/' + _filename).put(_imageBlob);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on('state_changed', // or 'state_changed'
      function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
        }
      }, function(error) {
        
          alert(error.message)
          _callback(null);

      }, function() {
        // Upload completed successfully, now we can get the download URL
        var downloadURL = uploadTask.snapshot.downloadURL;

        // when done, pass back information on the saved image
        _callback(uploadTask.snapshot)
      });
    }

    $scope.testUpload = function() {

    }



    */



  })

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
