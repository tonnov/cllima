
const fs = require('fs');
const axios = require('axios');

// const archivo = './data/data.json';


class Busquedas {

    _historial = [];
    dbPath = './data/data.json';


    constructor() {
        // leer DB si existe
        if (this.leerBD()) {
            this._historial = this.leerBD();
        }
    }

    get getHistorial(){

        return this._historial.map( lugar => {
            const palabras = lugar.split(' ');
            // return palabras;
            return palabras.map( palabra => `${palabra.charAt(0).toUpperCase()}${palabra.slice(1)}` ).join(' ');

        })

        return hist;
    }

    get paramsMapbox() {
        return {
            access_token: process.env.MAPBOX_TOKEN,
            limit: 5,
            language: 'es'
        }
    }

    get paramsOpenWeather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad( lugar = '' ) {
        //http request

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))

            
        } catch (error) {
            return [];
        }

    }

    async climaLugar(lat, lon) {
        
        try {
            
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {lat, lon, ...this.paramsOpenWeather}
            });

            const resp = await instance.get();

            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {

            return [];
            
        }

    }


    agregarHistorial(lugar = ''){

        if (this._historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this._historial = this._historial.splice(0,5);

        this._historial.unshift(lugar.toLocaleLowerCase());

        this.guardarDB()
    }

    guardarDB(){
        
        const payload = {
            historial: this._historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify( payload ));
    }

    leerBD(){

        if (!fs.existsSync(this.dbPath)) {
            return;
        }

        const info = fs.readFileSync(this.dbPath, { enconding: 'utf-8' });
        const data = JSON.parse(info);
        return data.historial;
    }


}

module.exports = Busquedas;