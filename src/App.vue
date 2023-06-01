<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8">
        <h3>Current Location</h3>
        <button @click="getCurrentLocation" class="btn btn-primary">Get Current Location</button>
		<div class="search-con">
			<input v-model="searchQuery" @keyup.enter="searchLocation" placeholder="Search Location" class="form-control mt-3">
			<button class="btn btn-info search-btn" @click="searchLocation">Search</button>
		</div>
        
        <location-map :target-position="targetPosition" v-if="currentLocation" :location-markers="markers"></location-map>
      </div>
      <div class="col-md-4">
        <h3>Search Results</h3>
        <location-table :places="searchResults"></location-table>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-12">
        <h3>Latest Searched Location Information</h3>
        <div v-if="latestLocation">
			<p><span class="result-title">Location: </span> {{ this.latestLocation.name }}</p>
			<p><span class="result-title">Time Zone: </span>{{ this.latestLocationTZ }}</p>
			<p><span class="result-title">Local Time: </span>{{ this.latestLocationTime }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LocationMap from './components/LocationMap.vue';
import LocationTable from './components/LocationTable.vue';
import axios from 'axios';


export default {
  name: 'App',
  components: {
    LocationMap,
    LocationTable,
  },
  data() {
	return {
		currentLocation: null,
		targetPosition: null,
		searchQuery: '',
		searchResults: [],
		markers: [],
		history: [],
		latestLocation: null,
		latestLocationTZ: null,
		latestLocationTime: null,
	};
  },
  
  methods: {
      async getUserLocation() {
        const longitude = this.latestLocation.center[0];
        const latitude = this.latestLocation.center[1];
        const query = await fetch(
          `https://api.mapbox.com/v4/examples.4ze9z6tv/tilequery/${longitude},${latitude}.json?access_token=${'sk.eyJ1IjoiZHlsYW40OTMyIiwiYSI6ImNsaWNhZmowdzBpZ3IzZW13MWU2cWd6ZXAifQ.L3zSA4ZqWN5gInL0KY6yew'}`,
          { method: 'GET' }
        );
        const data = await query.json();
        this.latestLocationTZ  = data.features[0].properties.TZID;
		this.latestLocationTime = new Date().toLocaleTimeString([], { timeZone: this.latestLocationTZ });
    },

    getCurrentLocation() {
		navigator.geolocation.getCurrentPosition(position => {
			
			this.currentLocation = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			};
			this.targetPosition = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			};
			this.markers.push(this.targetPosition)
		});
    },
    searchLocation() {
		axios
			.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + this.searchQuery + '.json', {
			params: {
				access_token: 'sk.eyJ1IjoiZHlsYW40OTMyIiwiYSI6ImNsaWNhZmowdzBpZ3IzZW13MWU2cWd6ZXAifQ.L3zSA4ZqWN5gInL0KY6yew',
			},
			})
			.then(response => {
				if (this.history.find(element => element == response.data.features[0].id)){
					alert('Duplicate Search Results, Try another one ~')
				}else {
					if (this.searchResults.length === 10) {
						this.searchResults.shift();
					}
					this.history.push(response.data.features[0].id)
					this.searchResults.push({ id: response.data.features[0].id,
						name: response.data.features[0].place_name, 
						coord: response.data.features[0].genometry,
						center: response.data.features[0].center});
					this.updateLatestLocation();
					this.searchQuery = "";
				}
				
			})
			.catch(error => {
				console.error(error);
			});
    },
    
    updateLatestLocation() {
		this.latestLocation = this.searchResults[this.searchResults.length - 1];
		this.getUserLocation();
		this.targetPosition = {
			lat: this.latestLocation.center[1],
			lng: this.latestLocation.center[0]
		}
		this.markers.push(this.targetPosition)
		this.currentLocation = {
			latitude: this.latestLocation.center[0],
			longitude: this.latestLocation.center[1],
		};
		
    }
  },
};
</script>

<style>
	input.form-control {
		width: 100%;
	}
	.container{
		margin-top: 100px;
	}
	.search-con{
		display: grid;
		grid-template-columns: 80% 20%;
		margin-bottom: 5px;
	}
	.search-btn{
		margin-top: 15px;
		height: 40px;
	}
	.result-title{
		font-size: 20px;
		font-weight: 500;
	}
</style>