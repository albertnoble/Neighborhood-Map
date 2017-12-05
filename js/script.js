var map;
var markers = [];

function initMap() {
    

        map = new google.maps.Map(document.getElementById('map'),{
            center: {lat: 34.427134, lng: -117.304337},
            zoom: 10
        });
        
       
        for (var i = 0; i < locations.length; i++) {
          
            var position = locations[i].location;
            var title = locations[i].title;
          
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            });
        
            markers.push(marker);
        
        }
        
        showListings()
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
    
    locations.forEach(function(catItem){
        self.catList.push(new Cat(catItem));
        
    });
        
};

var Cat = function(data){
    
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);

};

ko.applyBindings(new catView());