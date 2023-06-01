<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th></th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="place in places" :key="place.id">
                    <td><input type="checkbox" v-model="selectedPlaces" :value="place"></td>
                    <td>{{ place.name }}</td>
                </tr>
            </tbody>
        </table>
      <button @click="deleteSelected" class="btn btn-danger">Delete Selected</button>
    </div>
</template>
  
<script>

    export default {
        name: 'LocationTable',
        props: ['places'],
        data() {
            return {
                selectedPlaces: [],
            };
        },
        methods: {
            deleteSelected() {
                
                this.places.filter(place => !this.selectedPlaces.includes(place));
                
                this.selectedPlaces = [];
            },
        },
        watch: {
            
        }
    };
</script>
  