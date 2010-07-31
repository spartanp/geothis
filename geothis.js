var geothis = {
    handleMessage: function(e) {
        // handle the message only for the parent/top window, ignore iframes.
        if (window.top !== window) {
            return;
        }

        var name = e.name;

        switch(name) {
            case "getUrl":
                geothis.messageUrl();
                break;

            case "renderMatches":
                geothis.renderMatches(e.message);
                break;

            default:
                break;
        }
    },

    messageUrl: function() {
        var data = {url: document.location.href};
        geothis.tab.dispatchMessage("getMatchesForUrl", data);
    },

    renderMatches: function(matches) {
        
        var gmapMarkers = "";
        // only one match result.
        if (!matches.length) {
            gmapMarkers = geothis.generateMarkerMarkup(matches, 0);
        
        // more than one matches.
        } else {
            for (var i = 0, l = matches.length; i < l; i++) {
                gmapMarkers += geothis.generateMarkerMarkup(matches[i], i);
            }
        }

        var gmapImgUrl = 'http://maps.google.com/maps/api/staticmap' +
              '?sensor=false' +
              '&size=400x200&maptype=roadmap'+
               gmapMarkers;
        var div = document.createElement("div");
        div.innerHTML = '<img src="' + gmapImgUrl + '" alt="google maps" />';
        div.style.position = "absolute";
        div.style.right = "0";
        div.style.top = "0";
        document.body.appendChild(div);
    },

    generateMarkerMarkup: function(match, matchNumber) {
        
        // alphabet label for marker.
        var markerLabel = String.fromCharCode((matchNumber + 65)),
            location = match.place.name,
            type = match.place.type,
            woeid = match.place.woeId,
            lat = match.place.centroid.latitude,
            lon = match.place.centroid.longitude;

        return '&markers=color:blue|' +
                'label:' + markerLabel +
                '|' + lat + 
                ',' + lon;
    },

    tab: safari.self.tab,

    processGeoMatches: function(data) {
        alert(data);
    }

}

document.geothis = geothis;
safari.self.addEventListener("message", geothis.handleMessage, false);
