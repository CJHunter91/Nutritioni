var MapWrapper = require('../components/map-wrapper.js');
var StoreLocatorRequest = require('../apis/store-locator-request.js')

// make a make map container methof


var StoreLocator = function() {
    // state holders

    // ui components to be watching for events
    this.map = null;
    // ui instantiation
    this.render();
    this.populateMap();
    console.log(this.map);
}
StoreLocator.prototype = {

    render: function() {
        console.log("made it to render")
        var main = document.createElement('main');
        var createMapContainer = this.createMapContainer()
        main.appendChild(createMapContainer);
        
        document.body.appendChild(main);
    },

    createMapContainer: function() {
        console.log("made it to createMapContainer")
        var mapContainer = document.createElement('div');
        mapContainer.id = "map";
        mapContainer.width = 1000;
        mapContainer.height = 1000;
        var coords = { lat: 55.954276, lng: -3.197960};
        var zoom = 15;      
        this.map = new MapWrapper(mapContainer, coords, zoom);
        this.map.geolocate();
        return mapContainer

    },

    populateMap: function(){
        var storeLocatorRequest = new StoreLocatorRequest()
        storeLocatorRequest.makeGetRequest(function(responseData){
            var stores = JSON.parse(responseData);
            // console.log(stores)
            for (store of stores) {
                this.map.addInfoWindows(store.coords, store.title )
            }
        }.bind(this))
    }


    // addInfoWindow: function(coords, text) {
    //   var marker = this.addMarker(coords);
    //   marker.addListener('click', function() {
    //     var infoWindow = new google.maps.InfoWindow({
    //       content: text
    //     });
    //     infoWindow.open(this.map, marker); 
    //   });
    // },


}
module.exports = StoreLocator;


