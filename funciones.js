

/****************** Funciones para los efectos del encabezado************************/
let encabezado =document.getElementById("encabezado");
let encabezadoTexto = document.getElementById("encabezado-texto");
let header = document.getElementById("header");
let img = document.getElementById("img");

export default function efectoHeader(){

    setTimeout( ()=>{  
        encabezado.classList.add('encabezado2');
        encabezadoTexto.classList.add('encabezado-texto2');
        header.classList.add('header2');
        img.classList.add('img');
    } ,700 );
}

function agrandarEncabezado(){
    encabezado.classList.remove('encabezado2');
    encabezadoTexto.classList.remove('encabezado-texto2');
    header.classList.remove('header2');
    img.classList.remove('img');
}
function achicarEncabezado(){
    encabezado.classList.add('encabezado2');
    encabezadoTexto.classList.add('encabezado-texto2');
    header.classList.add('header2');
    img.classList.add('img');
}
encabezado.addEventListener("mouseover",agrandarEncabezado);
encabezado.addEventListener("mouseleave",achicarEncabezado);




/************************** Api Cotizacion ************************* */
let dolarCompra=0;
let dolarVenta =0;
export async function CotDolar(){

    const url = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales'
    const respuesta = await fetch(url);
   
    const cotizacion = await respuesta.json();
   console.log(cotizacion[0].casa.compra);
    dolarCompra = cotizacion[0].casa.compra;
    dolarVenta = cotizacion[0].casa.venta;

    let dlventa = document.getElementById("dlventa");
    dlventa.innerHTML = "$ " + dolarVenta;
    let dlcompra = document.getElementById("dlcompra");
    dlcompra.innerHTML = "$ " + dolarCompra;

}
CotDolar();


