//--------------------FORMULARIO------------------------//

import { clearImputs } from "./clearimputs.js"
import { solicitarViaje } from "../Main.js"

// Obtener el Form
const formContent = document.getElementById('contenedor')

// Obtener los input del Form
const formInputs = formContent.childNodes[1].childNodes[3].childNodes[3]
// console.log(formInputs[2])

// Obtener el boton Solicitar Viaje
const botonSolicitiar = document.getElementById('solicitar')

// Obtener el icono para cerrar el Form
const closeForm = document.querySelector('.icon-close')

// Obtener Boton Formulario
const enviarSolicitud = document.getElementById('enviarSolicitud')

const objImput = {
    nombre: formInputs[0],
    local: formInputs[1],
    contacto: formInputs[2],
    email: formInputs[3],
    direcion: formInputs[4],
    barrio: formInputs[5],
    localidad: formInputs[6],
    cp: formInputs[7]    
}


// ABRIR/CERRAR FORMULARIO

botonSolicitiar.addEventListener('click', (e) => {
    // Previene la accion por defecto del <button></button>
    e.preventDefault()
    // Remueve la Class "Inactive" que tiene el atributo display:none del Form   
    formContent.classList.remove("inactive")
   //  const menj = solicitarViaje
    // console.log(menj)

})

closeForm.addEventListener('click', () =>{
    console.log("first")
    // Agrega la Class "inactive" al form
    formContent.classList.add("inactive")
})

// RECOPILAR DATOS DEL CLIENTE DEL FORM

const recDatostwo = () =>{
    const form = document.getElementById('form')
    const datos = Object.fromEntries(new FormData(form)) 
    // const datos = new FormData(form) 
    return datos
}

const validarEmail = (email) => {
    // Expresión regular para validar correo electrónico
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  
  
  // ENVIAR SOLICITUD Y DATOS
  enviarSolicitud.addEventListener('click',(e) =>{
      e.preventDefault()
      for (let input of formInputs){
          input.classList.remove('inputerror')
      }

      let checket = formInputs[8].checked
      let datos = recDatostwo()
    //   console.log(datos)

      if(!checket){
          return console.log('marque el checkbox')
        }     
        if(datos.Nombre == ''){
            console.log('complete el campo nombre')            
            return objImput.nombre.classList.add('inputerror')
        } else {
            objImput.nombre.classList.remove('inputerror')
        }
        if(datos.Contacto == ''){
            console.log('complete el campo contacto')
            return objImput.contacto.classList.add('inputerror') 
        } else {
            objImput.contacto.classList.remove('inputerror')
        }
        // if(!validarEmail(datos.Email)){
        //     objImput.email.classList.add('inputerror')
        //     return console.log('complete el campo Email')
        // } else{
        //     objImput.email.classList.remove('inputerror')
        // }
        if(datos.Direccion == ''){
            console.log('complete el campo Direccion')
            return objImput.direcion.classList.add('inputerror') 
        } else{
            objImput.direcion.classList.remove('inputerror')
        }
        if(datos.Localidad == ''){
            console.log('complete el campo Localidad')
            return objImput.localidad.classList.add('inputerror')
        } else {
            objImput.localidad.classList.add('inputerror')
        }         
        // if(datos.CP == ''){
        //     return console.log('complete el campo Codigo Postal')
        // }
        solicitarViaje(datos)
        formContent.classList.add("inactive")
        // en este punto tengo que incluir el codigo para enviar los "datos" a la base de datos
        console.log(datos)
        clearImputs(formInputs)
        
    })