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

      let checket = formInputs[8].checked
      let datos = recDatostwo()
    //   console.log(datos)
       
      if(!checket){
          return console.log('marque el checkbox')
        }     
        if(datos.Nombre == ''){
            return console.log('complete el campo nombre')
        }
        if(datos.Local == ''){
            return console.log("complete el campo Empresa/local")
        }
        if(datos.Contacto == ''){
            return console.log('complete el campo contacto')
        }
        if(!validarEmail(datos.Email)){
            formInputs[3].classList.add('inputerror')
            return console.log('complete el campo Email')
        } else{
            formInputs[3].classList.remove('inputerror')
        }
        if(datos.Direccion == ''){
            return console.log('complete el campo Direccion')
        }
        if(datos.Localidad == ''){
            return console.log('complete el campo Localidad')
        }
        if(datos.CP == ''){
            return console.log('complete el campo Codigo Postal')
        }
        solicitarViaje()
        formContent.classList.add("inactive")
        // en este punto tengo que incluir el codigo para enviar los "datos" a la base de datos
        console.log(datos)
        clearImputs(formInputs)
        
    })