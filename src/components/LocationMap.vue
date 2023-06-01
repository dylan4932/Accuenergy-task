<template>
    <div>
        <gmap-map
            ref="mapRef"
            :zoom="12"    
            :center="center"
            style="width:100%;  height: 400px;">
            <gmap-marker
                :key="index"
                v-for="(m, index) in locationMarkers"
                :position="m"
                @click="center=m.position"
            ></gmap-marker>
        </gmap-map>
    </div>
</template>

<script>

    export default {
    name: 'LocationMap',
    props: {
            targetPosition: {
                type:Object,
                required: true
            },
            locationMarkers: []},
    data() {
        return {
            center: this.targetPosition,
            zoom: 12,
            locPlaces: [],
        };
    },
    
    watch: {
        targetPosition(newVal) {
            this.center = newVal;
        },
    },
};

    
</script>
  
<style>
.map-container {
  height: 400px;
  width: 100%;
}
</style>