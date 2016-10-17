angular.module('phoodie.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, mapService, $ionicPopup, $firebaseObject, $ionicModal, $cordovaGeolocation) {

  //mapService.init();
  var map;
  var geocoder;
  var myPopup;
  var autocomplete;
  var newLocation;
  var cityCircle;
  var markers = [];
  var placeCalled;

  var ref = firebase.database().ref();
  $scope.data = $firebaseObject(ref);


  $scope.initialize = function() {

    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
    });

    var infoWindow = new google.maps.InfoWindow({map: map});

    var posOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {

            //TIMES SQUARE LAT LONG
            var lat = 22.2782;
            var long = 114.1817;


            // ACTUAL LAT LONG
            //var lat  = position.coords.latitude;
            //var long = position.coords.longitude;

            var myLatlng = new google.maps.LatLng(lat, long);

            var mapOptions = {
              center: myLatlng,
              zoom: 17,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };  

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);   

            /*var circle = new google.maps.Circle({
              strokeColor: '#FF0000',
              strokeOpacity: 0.1,
              strokeWeight: 0,
              fillOpacity: 0.1,
              map: map,
              center: myLatlng,
              radius: 250
            }) */

            var restaurants = {
              location: {lat: lat, lng: long},
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

                              var contentString = '<div id="content">'+
                              '<div id="siteNotice">'+
                              '</div>'+
                              '<h4 id="firstHeading" class="firstHeading">'+place.name+'</h4>'+
                              '<div id="bodyContent">'+
                              '<p>' + place.vicinity + '</p>'+
                              '</div>'+
                              '</div>';

                              infoWindow.setContent(contentString);
                              //infoWindow.setContent(place.vicinity);
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




            var input = document.getElementById('pac-input');
            var searchBox = new google.maps.places.SearchBox(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function() {
              searchBox.setBounds(map.getBounds());
            });

            var markers = [];

            // [START region_getplaces]
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function() {

              var places = searchBox.getPlaces();

              if (places.length == 0) {
                return;
              }

              // Clear out the old markers.
              markers.forEach(function(marker) {
                marker.setMap(null);
              });
              markers = [];

              

              // For each place, get the icon, name and location.
              var bounds = new google.maps.LatLngBounds();
              places.forEach(function(place) {
                bounds.extend(place.geometry.location);
                var listener = google.maps.event.addListener(map, "idle", function() { 
                  if (map.getZoom() > 17) map.setZoom(17); 
                  google.maps.event.removeListener(listener); 
                });

                map.fitBounds(bounds);

                /*var circle = new google.maps.Circle({
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.1,
                  strokeWeight: 0,
                  fillOpacity: 0.1,
                  map: map,
                  center: place.geometry.location,
                  radius: 250
                }) */

                var restaurants = {
                  location: place.geometry.location,
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

                              var contentString = '<div id="content">'+
                              '<div id="siteNotice">'+
                              '</div>'+
                              '<h4 id="firstHeading" class="firstHeading">'+place.name+'</h4>'+
                              '<div id="bodyContent">'+
                              '<p>' + place.vicinity + '</p>'+
                              '</div>'+
                              '</div>';

                              infoWindow.setContent(contentString);
                              //infoWindow.setContent(place.vicinity);
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
                
              });
          });

                   $scope.map = map;   
                   $ionicLoading.hide();           

                 }, function(err) {
                  $ionicLoading.hide();
                  console.log(err);
                });


}


$scope.searchLocation = function() {

  //console.log(newLocation);
  //var myLatlng = newLocation.geometry.location;
  console.log(placeCalled[0]);
  var myLatlng = placeCalled[0].geometry.location;
  console.log(myLatlng);

  var infoWindow = new google.maps.InfoWindow({map: map});

  var posOptions = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0
  };

  $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {

    var mapOptions = {
      center: myLatlng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };  

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);   

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function() {
              searchBox.setBounds(map.getBounds());
            });

            var markers = [];
            // [START region_getplaces]
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function() {
              var places = searchBox.getPlaces();

              if (places.length == 0) {
                return;
              }

              var bounds = new google.maps.LatLngBounds();
              console.log(bounds);


              places.forEach(function(place) {
                placeCalled = places;
              });
            })

            var circle = new google.maps.Circle({
              strokeColor: '#FF0000',
              strokeOpacity: 0.1,
              strokeWeight: 0,
              fillOpacity: 0.1,
              map: map,
              center: myLatlng,
              radius: 250
            }) 

            var restaurants = {
              location: myLatlng,
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

            $scope.map = map;   
            $ionicLoading.hide();           

          }, function(err) {
            $ionicLoading.hide();
            console.log(err);
          });



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


$scope.getUser = function() {
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
  var storageRef = firebase.storage().ref();
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

                  $cordovaCamera.getPicture(options).then(function(imageURI){
                    window.resolveLocalFileSystemURL(imageURI, function(fileEntry){
                      fileEntry.file(function(file){

                        var reader = new FileReader();
                        reader.onloadend = function(){
                          // This blob object can be saved to firebase
                          var blob = new Blob([this.result], {type: "image/jpeg"});

                          //create the storage ref
                          var ref = storageRef.child('images/test');
                          // Uplaod the file
                          uploadPhoto(blob,ref);

                        };
                        reader.readAsArrayBuffer(file);

                      });
                    }, function(error){
                      console.log(error);
                    })
                  })


                  /*$cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.imgURI = "data:image/jpeg;base64," + imageData;
                  }, function (err) {
                        // An error occured. Show a message to the user
                        console.log("ERROR: " + error);
                  }); */
                }

                $scope.uploadPhoto = function(file, ref){
                  var task = ref.put(file);
                  //Update progress bar
                  task.on('state_changed', function(snapshot){
                    //nothing
                  }, function(error){
                    //handel unsuccessful uploads
                  }, function(){
                    //handle successful uploads on complete
                    $scope.downloadURL = task.snapshot.downloadURL;
                    $scope.actualKey = databaseRef.child('posts').push().key;

                    databaseRef.child('posts/' + $scope.actualKey).update({
                      url: $scope.downloadURL,
                      id: $scope.actualKey,
                      time: firebase.database.ServerValue.TIMESTAMP,
                    })
                  })
                }

              })



.controller('UserCtrl', function($scope, $firebaseObject, $ionicPopup, $window, $rootScope){
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

  $scope.goBackToLogin = function(){
    createAccountPopup.close();
    $scope.loginPopUp();
  }

  $scope.createAccountTemplate = function() {
      loginPopup.close();
      console.log('actually closed');
      $scope.data = {};
      createAccountPopup = $ionicPopup.show({
        templateUrl: 'templates/createAccount.html',
        title: 'Create Account',
        buttons: [
          { text: '', type: 'close-popup ion-ios-close-outline' }
        ]
      })

  } 

  $scope.createAccountAction = function(firstName, lastName, email, password, confirmPassword){
    console.log(firstName, lastName, email, password, confirmPassword);

    firstName = firstName.toLowerCase();
    var modFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    console.log(modFirstName);

    lastName = lastName.toLowerCase();
    var modLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    console.log(modLastName);


    if(password !== confirmPassword){
      // alert password has to be same
       var alertPopup = $ionicPopup.alert({
        title: 'Password Does Not Match!',
        template: 'Please Reconfirm Your Password'
      })
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error){
        //handle errors here
        var errorCode = error.code;
        var errorMessage = error.message;
      })

      setTimeout(function(){
        $scope.createUserName(modFirstName, modLastName);
      }, 1100);

      }

  }

  $scope.createUserName = function(modFirstName, modLastName){

    var user = firebase.auth().currentUser;
    var fullName = modFirstName + ' ' + modLastName;

    if(user == null){
      // create account error
      var confirmAccountPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'The e-mail you provided already exists in our system, please login with the provided email or resgister with another email address'
        })



    } else {

      user.updateProfile({
        displayName: fullName
      }).then(function(){
        console.log('update successful');
        createAccountPopup.close();

        var confirmAccountPopup = $ionicPopup.alert({
          title: 'Account Created',
          template: 'Welcome, ' + fullName
        })


      }, function(error){
        console.log('error');
      })

    }

  }

  $scope.getCurrentUserInfo = function(){

    var user = firebase.auth().currentUser;

    $rootScope.displayName = user.displayName;
    $rootScope.email = user.email;
    //console.log(email);

  }


  $scope.doLogin = function(email, password){
    console.log(email);
    console.log(password);
    
    firebase.auth().signInWithEmailAndPassword(email,password).catch(function(error){
      // error alert popup

      var errorLoginPopup = $ionicPopup.alert({
          title: 'Login Error',
          template: 'Please double check your login e-mail or password. Sign up for an account if you do not have one yet.'
        })



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

    var user = firebase.auth().currentUser;
    var display;

    if(user.displayName != null){
      display = user.displayName;
    } else {
      display = userEmail;
    }


    var loginSuccessPopup = $ionicPopup.alert({
      title: 'Login Successful!',
      template: 'Welcome, ' + display
    })

  }

  $scope.forgetPassword = function(){
    loginPopup.close();

    forgetPasswordPopup = $ionicPopup.show({
        templateUrl: 'templates/forgetPassword.html',
        title: 'Forget Password',
        buttons: [
          { text: '', type: 'close-popup ion-ios-close-outline' }
        ]
      })


  }



  $scope.resetPassword = function(email){
    var auth = firebase.auth();
    var emailAddress = email;

    auth.sendPasswordResetEmail(emailAddress).then(function(){
      console.log('email sent');

      forgetPasswordPopup.close();

      var confirmPasswordPopup = $ionicPopup.alert({
        title: 'Password Reset',
        template: 'An password reset e-mail has been sent to your e-maill address. Please follow the instructions on the e-mail to reset your password.'
      })


    }, function(error){
      console.log('error happened');
      var errorPasswordPopup = $ionicPopup.alert({
         title: 'Password Reset',
        template: 'We couldn not find your e-mail address in our database, please make sure your e-mail address was correctly typed.'
      })

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


  $scope.confirmLogout = function(){
    var confirmLogoutPopup = $ionicPopup.confirm({
      title: 'Confirm Logout',
      template: 'Are you sure you want to logout?'
    })
    confirmLogoutPopup.then(function(res){
      if(res){
        $scope.doLogout();
      } else {
        //do nothing
      }
    })
  }


  $scope.doLogout = function(){
    firebase.auth().signOut().then(function(){

      var loginSuccessPopup = $ionicPopup.alert({
        title: 'Successfully Signed Out',
      })

      loginSuccessPopup.then(function(res){
        $window.location.reload(true);
      })

      console.log('Successfully signed out');
      loggedIn = 0;
      $window.location.href = '#/tab/maps';
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


      }, function (error) {
        // error getting photos
      });
  }



    // from firebase/storage/web/upload-files

    /*

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
    }*/



  });

