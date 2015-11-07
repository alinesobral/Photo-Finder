//219958476.5b2b065.70ccdb0853544c48b7a31676d15e903e
var instaLinks = [];
var places = [
	{
		latLng: {lat: 43.656020, lng: -79.403595},
		title: 'First Pub'
	},
	{
		latLng: {lat: 43.646757, lng: -79.462470},
		title: 'High Park'
	},
	{
		latLng: {lat: 43.66994, lng: -79.39338},
		title: 'Carens Restaurant'
	},
	{
		latLng: {lat: 43.66566, lng: -79.46806},
		title: 'Farmer\'s Market'
	},
	{
		latLng: {lat: 43.64240, lng: -79.38597},
		title: 'Ripley\'s Aquarium of Canada'
	},
	{
		latLng: {lat: 43.64904, lng: -79.39591},
		title: 'Horseshoe Tavern'
	},
	{
		latLng: {lat: 43.66487, lng: -79.41317},
		title: 'Snakes & Lattes'
	},
	{
		latLng: {lat: 43.6284858, lng: -79.3981464},
		title: 'Billy Bishop Toronto City Airport'
	},
	{
		latLng: {lat: 43.64993, lng: -79.39082},
		title: 'Cafe Crepe'
	},
	{
		latLng: {lat: 43.647792, lng: -79.414191},
		title: 'Trinity Bellwoods Park'
	},
	{
		latLng: {lat: 43.678024, lng: -79.409502},
		title: 'Casa Loma'
	}
];

function initMap() {
	var myLatLng = {lat: 43.653598, lng: -79.426550};

	var mapa = new google.maps.Map(document.getElementById('map'), {
		center: myLatLng,
		zoom: 13
	});
	 
	var marker, i, j, infoWindow;
	//var markersList = [];
	var length = places.length;
	for (i = 0; i < length; i++) {
		infowindow = new google.maps.InfoWindow();
		//markersList.push(places[i].markers);

		//Create a marker property for each item in the place object, linked to a Google Maps marker
		 places[i].marker = new google.maps.Marker({
			position: places[i].latLng,
			map: mapa,
			title: places[i].title,
			contentString: 'No image available now. Please, try again in a few seconds. :)',
			animation: google.maps.Animation.DROP
		});
		places[i].marker.addListener('click', toggleBounce);

		//creating infoWindow and setting its content
		google.maps.event.addListener(places[i].marker, 'click', function() {
			infowindow.setContent(this.contentString);
			infowindow.open(mapa, this);
		});
	}

	function toggleBounce() {
		if (this.getAnimation() !== null) {
			this.setAnimation(null);
		} else {
			this.setAnimation(google.maps.Animation.BOUNCE);	
		}
	}

	$(".description").hide();

	$("button").click(function(){
	$(".description").toggle();
	});

	$(function() {
		var self = this;
		var viewModel = {
			query: ko.observable('')
		};
	
		viewModel.places = ko.dependentObservable(function() {
			var search = this.query().toLowerCase();
			return ko.utils.arrayFilter(places, function(locations) {
				if (locations.title.toLowerCase().indexOf(search) >= 0) {
					/*If the content on the search bar matches the location's title,
					then set the marker to true, making it visible on the page */
					locations.marker.setVisible(true);
					return true;
				}
				else {
					//else, hide the marker on the page
					locations.marker.setVisible(false);
				}
			});
		}, viewModel);
		ko.applyBindings(viewModel);  
	});
	//create array of links from Instagram's API
	//each link contains a JSON
	for (var i = 0; i < places.length; i++) {
		instaLinks.push("https://api.instagram.com/v1/media/search?lat=" + 
			places[i].latLng.lat+ "&lng=" + places[i].latLng.lng + 
			"&access_token=219958476.5b2b065.70ccdb0853544c48b7a31676d15e903e");
	}

	//Using Ajax to manipulate the JSON from each link in instaLinks
	var j = 0;
	var ajaxSequencer = function() {
		$.ajax({
			dataType: "jsonp",
		url: instaLinks[j],
		corsSupport: true,
		//jsonpSupport: true,
		success: function(insta) {
			places[j].marker.contentString = '<div class="infowindow"><img src="http://files.gandi.ws/gandi19935/image/instagram-icon-logo.png" height="30" width="150"><p>Photo by @' + insta.data[0].user.full_name + 
			'</p><a href="'+ insta.data[0].link +'"><img src ="'+ insta.data[0].images.low_resolution.url +'" height="250" width = "250"></a><p>' + 
			insta.data[0].caption.text + 
			'</p></div>';
			j++;
			//calling the ajaxsequencer function for each item in instaLinks
			if (j<instaLinks.length) {
				ajaxSequencer();
			}
		},
		error: function() {
			places[j].marker.contentString = 'I\'m sorry, but the data request failed.';
			j++;
			if (j<instaLinks.length) {
				ajaxSequencer();
			}
		}
		});
	};
	ajaxSequencer();
};


