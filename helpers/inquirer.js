
const inquirer = require('inquirer');
require('colors');


const menuOpts = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        choices: [
            {
                value: 1,
                name: 'Buscar ciudad'
            },
            {
                value: 2,
                name: 'Historial'
            },
            {
                value: 0,
                name: 'Salir'
            }
        ]
        
    }
]

const mainMenu = async () => {
    console.clear();
    console.log('========================='.green);
    console.log('  Seleccione una opción  '.white);
    console.log('=========================\n'.green);

    const { opcion } = await inquirer.prompt(menuOpts);
    return opcion;
}

const pausa = async () => {
    console.log('\n');
    await inquirer.prompt([
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'ENTER'.yellow } para continuar `
        }
    ]) 
}

const leerInput = async (message) => {

    const { ciudad } = await inquirer.prompt([
        {
            type: 'input',
            name: 'ciudad',
            message,
            validate( value ){
                if(value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ])

    return ciudad;

}

const listarLugares = async ( lugares = []) => {

    const choices = lugares.map( (lugar, idx) => ({
        value: lugar.id,
        name: `${ ++idx }. ${lugar.nombre}`
    }));

    choices.unshift({
        value: 0,
        name: '0. Cancelar'
    });

    const { id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]);

    return id;

}




const listadoTareasChecklist = async( tareas = []) => {
    
    const choices = tareas.map( (tarea, idx) => {

        return {
            value: tarea.id,
            name: `${ ++idx } ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        }

    });
    
    const { ids } = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices: tareas.map( (tarea, idx) => {

                        return {
                            value: tarea.id,
                            name: `${ ++idx } ${tarea.desc}`,
                            checked: (tarea.completadoEn) ? true : false
                        }
                    })
        }
    ]);
    
    return ids;
}


module.exports = { mainMenu, pausa, leerInput, listarLugares }