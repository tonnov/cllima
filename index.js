
require('dotenv').config();
require('colors');

const { mainMenu, pausa, leerInput, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {

    const busquedas = new Busquedas();
    let opcion;
    
    do {

        opcion = await mainMenu();

        switch (opcion) {
            case 1:
                const ciudad = await leerInput('Ciudad:');
                const lugares = await busquedas.ciudad( ciudad );
                const id = await listarLugares(lugares);
                if (id === 0) continue;
                    const lugarSel = lugares.find( l => l.id == id )
                    busquedas.agregarHistorial(lugarSel.nombre);
                    const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                    // console.log( clima );
    
                    console.log('\n:::: Información de la Ciudad ::::\n'.blue);
                    console.log('Ciudad:', lugarSel.nombre.cyan);
                    console.log('Lat:', lugarSel.lat);
                    console.log('Lng:', lugarSel.lng);
                    console.log('Temperatura:', clima.temp);
                    console.log('Mínima:',clima.min);
                    console.log('Máxima:', clima.max);
                    console.log('Situacion climatica:',(clima.desc).cyan);
        
            break;
            case 2:
                //Historial
                const hist = busquedas.getHistorial;
                console.log(hist);
            break;
            default:
                break;
        }
    
        if( opcion !== 0) await pausa();

    } while( opcion !== 0 )

}


main();
