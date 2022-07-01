
/*
***************************************************************************************
Alumno: de la Viña, Leandro
Proyecto: Control de gastos diarios - mensuales

***************************************************************************************
*/

let fecha=0;
let descripcion = "";
let tipo ="";
let metodo ="";
let monto = 0;
let datos = [];
let id ="";

// Variables para INGRESOS
let ingresos =[]; // Se almacenan   datos de los ingresos
let ingresosBanco=[];
let totalIngresosBanco =0;
let ingresosEfectivo=[];
let totalIngresosEfectivo =0;

//Variables para GASTOS
let gastos =[]; // Se almacenan todos los movimientos de gastos
let gastosEfectivo =[];
let totalGastosEfectivo =0;
let gastosBanco =[];
let totalGastosBanco =0;

// Variables para TOTALES
let dineroBanco = totalIngresosBanco - totalGastosBanco;
let dineroEfectivo = totalIngresosEfectivo - totalGastosEfectivo;
let dineroTotal = dineroBanco + dineroEfectivo;

let dolarCompra=0;
let dolarVenta =0;







//-------- Eventos -----------------

window.onload = function(){
   // Recuperar el localstorage
    if(localStorage.getItem("InfoMovimientos").length > 0){
    datos = JSON.parse(localStorage.getItem("InfoMovimientos")); 
   
    Mostrar();

   }  

}

/************************** Api Cotizacion ************************* */

async function CotDolar(){

    const url = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales'
    const respuesta = await fetch(url);
   
    const cotizacion = await respuesta.json();
   // console.log(cotizacion[0].casa.compra);
    dolarCompra = cotizacion[0].casa.compra;
    dolarVenta = cotizacion[0].casa.venta;

    let dlventa = document.getElementById("dlventa");
    dlventa.innerHTML = dolarVenta;
    let dlcompra = document.getElementById("dlcompra");
    dlcompra.innerHTML = dolarCompra;

}
CotDolar()


/************************* Fecha con Luxon ------------------------- */

const DateTime= luxon.DateTime;
//console.log(DateTime);
const Hoy = DateTime.now();
//console.log(Hoy.toLocaleString())

/* ------------------------- Objeto para almacenar los datos ---------------------------*/

class movimientos{
   
    constructor(fecha,descripcion,tipo,metodo, monto, id){
            this.fecha = fecha;
            this.descripcion = descripcion;
            this.tipo = tipo;
            this.metodo = metodo;
            this.monto = monto; 
            this.id = id
    }
}

/*---------------------------Funcion de nùmeros aleatoreos--------------------------------*/

function Generarid(){
    let ID = '';
    let CARACTERES ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!·%?¿|@';
    for(let i=0; i<6; i++){
        ID += CARACTERES.charAt(Math.floor(Math.random()*CARACTERES.length));

    }
    for(const info in datos){
        console.log(datos[info].id)
    }

    return ID;
}


/* ------------------------- Funciones para procesar los datos ---------------------------*/
function ValidarDatos(){
    /*
        Valida los datos cuando se presiona el boton guardar en el formulario
        de ingreso de datos del modal.
        Si el Formulario esta completo guarda los datos por funcion "Guardar()".
    */
    descripcion =   document.getElementById("descripcion").value;
    monto =         parseInt(document.getElementById("monto").value);

    descripcion.length !=0 && !isNaN(monto) ? GuardarDatos(): swal({
        title: "Cuidado",
        text: "Debe ingresar la descripcion y el monto!",
        icon: "warning",
      });;

}

function GuardarDatos(){
    /*
       Obtiene los datos del formulario y los alamacena en las variables, 
       array "dato" y Storage!
     */

    fecha = Hoy.toLocaleString();
    descripcion =   document.getElementById("descripcion").value;
    tipo =          document.getElementById("tipo").value;
    metodo =        document.getElementById("metodo").value;
    monto =         parseInt(document.getElementById("monto").value);
    id=             Generarid();
    
    let monto1 = new movimientos(fecha,descripcion, tipo, metodo, monto, id);
    datos.push(monto1);
    localStorage.setItem("InfoMovimientos", JSON.stringify(datos));

    cerrarModal();
    CalcularValores ();
    ActualizarTabla(monto1);
}


function CalcularValores (){
    /*
    Funcion que calcula los valores de dinero en efectivo, dinero en el banco,
    dinero total acumulado y resta los gastos!
    */ 
   

// INGRESOS
    ingresos = datos.filter( (el)=>el.tipo == "Ingreso" );

    ingresosBanco = ingresos.filter( (el)=> el.metodo == "Banco");
    totalIngresosBanco =  ingresosBanco.reduce( (acc,el)=>acc + el.monto, 0 );

    ingresosEfectivo = ingresos.filter( (el)=> el.metodo == "Efectivo");
    totalIngresosEfectivo =  ingresosEfectivo.reduce( (acc,el)=>acc + el.monto, 0 );
    
//GASTOS

    gastos = datos.filter( (el)=>el.tipo == "Gastos" ); // todos los gastos

    gastosBanco = gastos.filter( (el)=> el.metodo == "Banco"); // Gastos mediante banco
    totalGastosBanco = gastosBanco.reduce( (acc,el)=>acc + el.monto, 0); // monto total gasto banco

    gastosEfectivo = gastos.filter( (el)=> el.metodo == "Efectivo"); // Gastos mediante banco
    totalGastosEfectivo = gastosEfectivo.reduce( (acc,el)=>acc + el.monto, 0); // monto total gasto banco


    // TOTALES
 dineroBanco = totalIngresosBanco - totalGastosBanco;
 dineroEfectivo = totalIngresosEfectivo - totalGastosEfectivo;
 dineroTotal = dineroBanco + dineroEfectivo;
}

function Mostrar(){
    
    CalcularValores();
    CotDolar();
    /*
      Funcion que crea la tabla sobre el HTML al cargar 
      la página
     */
   
   let cuerpoTabla = document.getElementById("cuerpoTabla");
    
    for(const dato of datos){

        const TR = document.createElement('tr');

        for(const propiedad in dato){
              
            if(propiedad == "id"){
                break;
              }
                const TH =document.createElement('th');
                const TextMonto = document.createTextNode(dato[propiedad]);
                TH.appendChild(TextMonto);
                TR.appendChild(TH);
            }

                const TH2 =document.createElement('th');
                let BotonRemove = document.createElement("button");
                const TextBoton = document.createTextNode("Eliminar");
                BotonRemove.appendChild(TextBoton);
                BotonRemove.classList.add("btn_remove");
                BotonRemove.addEventListener("click",(e)=>{ BTN_Eliminar(e, dato.id)}  );
                TH2.appendChild(BotonRemove);
                TR.appendChild(TH2);
                cuerpoTabla.appendChild(TR);
            
        }
    let total = document.getElementById("ttl");
        total.innerHTML = dineroTotal;
    let banco = document.getElementById("bn");
        banco.innerHTML = dineroBanco;
    let efectivo = document.getElementById("ef");
        efectivo.innerHTML = dineroEfectivo;


}


function BTN_Eliminar(e,IdInfo){
    e.target.parentNode.parentNode.remove(); //Elimina la fila de la tabla en el DOM
    let indice =0;
    for(const info of datos){
        if(info.id == IdInfo){
            console.log(datos)
            datos.splice(indice,1);
            localStorage.removeItem("InfoMovimientos");
            localStorage.setItem("InfoMovimientos", JSON.stringify(datos));
            console.log(datos)
            break;
        }
       
        indice++
    }

}


function ActualizarTabla(info){
    /**
     Actualiza la tabla cada vez que el usuario agrega un dato
     */
     CalcularValores();

    let cuerpoTabla = document.getElementById("cuerpoTabla");
    const TR = document.createElement('tr');
           for(const propiedad in info){
            
            if(propiedad == "id"){
                break;
              }
                const TH =document.createElement('th');
                const TextMonto = document.createTextNode(info[propiedad]);
                TH.appendChild(TextMonto);
                
                TR.appendChild(TH);
            }
                const TH2 =document.createElement('th');
                let BotonRemove = document.createElement("button");
                const TextBoton = document.createTextNode("Eliminar");
                BotonRemove.appendChild(TextBoton);
                BotonRemove.classList.add("btn_remove");
                BotonRemove.addEventListener("click",(e)=>{ BTN_Eliminar(e, info.id)}  );
                TH2.appendChild(BotonRemove);
                TR.appendChild(TH2);
            
            cuerpoTabla.appendChild(TR);
            let total = document.getElementById("ttl");
            total.innerHTML = dineroTotal;
            let banco = document.getElementById("bn");
            banco.innerHTML = dineroBanco;
            let efectivo = document.getElementById("ef");
            efectivo.innerHTML = dineroEfectivo;
}

/* ------------------------- Funciones el MODAL ---------------------------*/
let btn_addIngreso = document.getElementById("addIngresos");
btn_addIngreso.addEventListener("click", abrirModal);

let btn_cerrarModal = document.getElementById("btn_cerrarModal");
btn_cerrarModal.addEventListener("click", cerrarModal); 

let modal_ingreso = document.getElementById("modal_ingreso");
function abrirModal(){
    modal_ingreso.classList.add('mostrar_modal');
}
function cerrarModal(){
    modal_ingreso.classList.remove('mostrar_modal');
    
}




let btnGuardar = document.getElementById("Guardar");
    btnGuardar.addEventListener("click",ValidarDatos);
    btnGuardar.addEventListener("mouseover",CambiarColor);
    btnGuardar.addEventListener("mouseleave",CambiarColorOriginal);


function CambiarColor(){
    monto =  parseInt(document.getElementById("monto").value);
    if( isNaN(monto)){
        btnGuardar.classList.add('btn_guardar_error');
    }
    else{
        btnGuardar.classList.add('btn_guardar_ok');
    }
}
function CambiarColorOriginal(){
    btnGuardar.classList.remove('btn_guardar_ok', 'btn_guardar_error');
    
}
