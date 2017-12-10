var map;
var markers = [];
var currentMarker;

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
        
        var iconBase = 'images/burger.png';
        var icons = {
          burger: {
            icon: iconBase
          }
        };
        
       
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
            var infowindow = new google.maps.InfoWindow();
        
            markers.push(marker);
            
            marker.addListener('click', function(){
                populateInfoWindow(this, infowindow);
            });
            
            marker.addListener('click', function(){
                bounceMarkers(this);
            });
        }
        
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
        
        function bounceMarkers(marker){
            for (var i = 0; i < markers.length; i++){
                markers[i].setAnimation(null);
            }
            marker.setAnimation(google.maps.Animation.BOUNCE);
            
        }
        
        showListings();
        
        for(var i = 0; i < markers.length; i++){
            //document.getElementById(markers[i].title).addEventListener('click',animateds(markers[i]));
        }
        
        function animateds(marker){
            alert("hello");
        }
        
        
}

function showListings() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
}





var catView = function(){
    var self = this;
    
    this.catList = ko.observableArray([]);
    
    this.userName = ko.observable("");
    
    this.currentLocations = ko.observableArray([]);
    
    locations.forEach(function(catItem){
        self.catList.push(new Cat(catItem));
        
        
    });
    
    this.filter = ko.computed(function(){
        var filt = this.userName().toLowerCase();
        for(var i = 0; i < markers.length; i++){
            if (markers[i].title.toLowerCase().indexOf(filt) == -1){
                markers[i].setMap(null);
            }else{
                markers[i].setMap(map);
            }
        }
        
        
        
    }, this);
    
    
};

var Cat = function(data){
    
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);

};

ko.applyBindings(new catView());