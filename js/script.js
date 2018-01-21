var map;
var markers = [];
var currentMarker;
var infowindow;
var wikiarticles;


/**
*@description Initializes the Google Maps Api
*/
function initMap() {

        map = new google.maps.Map(document.getElementById('map'),{
            center: {lat: 34.427134, lng: -117.304337},
            zoom: 10,
            styles: [
                {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
                {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
                {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
                {
                  featureType: 'administrative.locality',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#d59563'}]
                },
                {
                  featureType: 'poi',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#d59563'}]
                },
                {
                  featureType: 'poi.park',
                  elementType: 'geometry',
                  stylers: [{color: '#263c3f'}]
                },
                {
                  featureType: 'poi.park',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#6b9a76'}]
                },
                {
                  featureType: 'road',
                  elementType: 'geometry',
                  stylers: [{color: '#38414e'}]
                },
                {
                  featureType: 'road',
                  elementType: 'geometry.stroke',
                  stylers: [{color: '#212a37'}]
                },
                {
                  featureType: 'road',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#9ca5b3'}]
                },
                {
                  featureType: 'road.highway',
                  elementType: 'geometry',
                  stylers: [{color: '#746855'}]
                },
                {
                  featureType: 'road.highway',
                  elementType: 'geometry.stroke',
                  stylers: [{color: '#1f2835'}]
                },
                {
                  featureType: 'road.highway',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#f3d19c'}]
                },
                {
                  featureType: 'transit',
                  elementType: 'geometry',
                  stylers: [{color: '#2f3948'}]
                },
                {
                  featureType: 'transit.station',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#d59563'}]
                },
                {
                  featureType: 'water',
                  elementType: 'geometry',
                  stylers: [{color: '#17263c'}]
                },
                {
                  featureType: 'water',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#515c6d'}]
                },
                {
                  featureType: 'water',
                  elementType: 'labels.text.stroke',
                  stylers: [{color: '#17263c'}]
                }
            ]
            
        });
        
        //Change icon to a burger
        var iconBase = 'images/burger.png';
        var icons = {
          burger: {
            icon: iconBase
          }
        };
        
        //Populate the markers variable with the locations from the model
        for (var i = 0; i < locations.length; i++) {
          
            var position = locations[i].location;
            var title = locations[i].title;
          
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i,
                icon: icons['burger'].icon,
            });
            infowindow = new google.maps.InfoWindow();
        
            markers.push(marker);
            
            marker.addListener('click', function(){
                populateInfoWindow(this, infowindow);
                populateWikiArticles(this);
            });
            
            marker.addListener('click', function(){
                bounceMarkers(this);
            });
        }
        
        showRestaurants();
        
}

/**
*@description Makes the marker bounce
*@param {object} marker - The restaurant marker
*/
 function bounceMarkers(marker){
    for (var i = 0; i < markers.length; i++){
        markers[i].setAnimation(null);
    }
    marker.setAnimation(google.maps.Animation.BOUNCE);
                    
}

/**
*@description Adds info window to a marker
*@param {object} marker - The restaurant marker
*@param {object} infowindow - The Google API infowindow
*/
function populateInfoWindow(marker, infowindow) {
    if (marker != currentMarker){
        currentMarker = marker;
        infowindow.marker = marker;
        infowindow.setContent('<div>'+ marker.title +'</div>');
        infowindow.open(map, marker);
        infowindow.addListener('closeclick',function(){
            for (var i = 0; i < markers.length; i++){
                markers[i].setAnimation(null);
            }
            currentMarker = null;
        });
    }else{
        infowindow.close(map, marker);
        currentMarker = null;
    }   
}

/**
*@description Adds the markers to the map
*/
function showRestaurants() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

var RestaurantView = function(){
    var self = this;
    
    this.restaurantList = ko.observableArray([]);
    
    this.userName = ko.observable("");
    
    wikiarticles = ko.observable("");
    
    this.currentLocations = ko.observableArray([]);
    
    locations.forEach(function(item){
        self.restaurantList.push(new Restaurant(item));
    });
    
    //filters the markers on the map according to the filter input field
    this.filter = ko.computed(function(){
        var filt = this.userName().toLowerCase();
        for(var i = 0; i < markers.length; i++){
            if (markers[i].title.toLowerCase().indexOf(filt) == -1){
                markers[i].setMap(null);
            }else{
                markers[i].setMap(map);
            }
        }
        
        self.restaurantList.removeAll();
        locations.forEach(function(item){
            if (item.title.toLowerCase().indexOf(filt) != -1){
                self.restaurantList.push(new Restaurant(item));
            }
        });
        
    }, this);
    
    this.targetLocation = function(){
        for (var i = 0; i < self.restaurantList().length; i++){
            if (self.restaurantList()[i] == this){
                bounceMarkers(markers[i]);
                populateInfoWindow(markers[i], infowindow);
                populateWikiArticles(markers[i]);
                
            }
        }
        
    }
    
};

/**
*@description Creates a Restaurant observable object
*@param {object} data - The restaurant object from the model
*/
var Restaurant = function(data){
    
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);

};

ko.applyBindings(new RestaurantView());

/**
*@description Populates the Wiki Articles section with info on the selected restaurant
*@param {object} marker - The restaurant marker
*/
function populateWikiArticles(marker){
    //Wikipedia API
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ marker.title +'&format=json&callback=wikiCallback';
    
    wikiarticles('');
    
    $.ajax(wikiUrl, {
        dataType: "jsonp",
        success: function(response){
            var articles = response[1];
            for (var i = 0; i < articles.length; i++){
                article = articles[i];
                var url = 'http://en.wikipedia.org/wiki/'+article;
                wikiarticles(wikiarticles()+'<li><a href="'+url+'">'+article+'</a></li>');
            }
        }
    }).fail(function(xhr, status, errorThrown){
        wikiarticles('<li>Could not load Wikipedia articles</li>');
    });
}

/**
*@description Error handling function for google maps
*/
function googleError(){
        document.getElementById('map').innerHTML += '<p>Google Maps could not load</p>';
}