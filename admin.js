firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function cargarPedidos(){
  db.collection("pedidos")
    .orderBy("fecha", "desc")
    .onSnapshot((snapshot)=>{
      const pedidos = [];
      snapshot.forEach(doc=>{
        pedidos.push({id: doc.id, ...doc.data()});
      });
      
      mostrarPedidos(pedidos);
      actualizarEstadisticas(pedidos);
      crearGraficaVentas(pedidos);
    });
}


import { db } from "./firebase-db.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// 🔐 PROTEGER PANEL
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "admin-login.html";
  }
});


let cantidadAnteriorPedidos = 0;

let productos = JSON.parse(localStorage.getItem("productos")) || [];

window.cargarAdmin = function(){
   const cont = document.getElementById("listaAdmin");
   cont.innerHTML = "";

   productos.forEach(p => {
      cont.innerHTML += `
         <div class="card-admin">
            <img src="${p.imagen}" width="60">

            <input value="${p.nombre}" 
              onchange="editar('${p.id}','nombre',this.value)">

            <input type="number" value="${p.precio}" 
              onchange="editar('${p.id}','precio',this.value)">

            <input type="number" value="${p.stock || 0}" 
              onchange="editar('${p.id}','stock',this.value)">

            <button onclick="eliminar('${p.id}')">Eliminar</button>
         </div>
      `;
   });
}


window.editar = function(id,campo,valor){
   const p = productos.find(x=>x.id==id);
   p[campo] = valor;
   guardar();
}


window.eliminar = function(id){
   productos = productos.filter(p=>p.id!=id);
   guardar();
   cargarAdmin();
}


window.nuevoProducto = function(){
   const nuevo = {
      id: Date.now(),
      nombre: "Nuevo producto",
      precio: 0,
      imagen: "",
      stock: 0
   };

   productos.push(nuevo);
   guardar();
   cargarAdmin();
}


window.guardar = function(){
   localStorage.setItem("productos", JSON.stringify(productos));
}

cargarAdmin();


window.cargarPedidos = function(){

  const q = query(
    collection(db, "pedidos"),
    orderBy("fecha", "desc")
  );

  onSnapshot(q, (snapshot) => {

    const pedidos = [];

    snapshot.forEach(doc => {
      pedidos.push({ id: doc.id, ...doc.data() });
    });
}


let ultimoPedidoID = Number(localStorage.getItem("ultimoPedidoID")) || 0;

window.detectarPedidosNuevos = function(){

   const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

   if(pedidos.length === 0) return;

   const masReciente = pedidos[pedidos.length - 1];

   if(masReciente.id > ultimoPedidoID){
         mostrarToast();
         reproducirSonido();
         animarBadge();
         actualizarTituloNavegador();

      ultimoPedidoID = masReciente.id;
      localStorage.setItem("ultimoPedidoID", ultimoPedidoID);
   }
}


window.actualizarEstadisticas = function(){

   const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

   const hoy = new Date();
   const hoyTexto = hoy.toLocaleDateString();

   let totalPedidos = pedidos.length;
   let pendientes = pedidos.filter(p => p.estado === "pendiente").length;

   let totalHoy = 0;
   let totalGeneral = 0;
   let ventasSemana = 0;

   const hace7Dias = new Date();
   hace7Dias.setDate(hoy.getDate() - 7);

   pedidos.forEach(p => {

      const total = Number(p.total) || 0;
      totalGeneral += total;

      if(p.fecha && p.fecha.includes(hoyTexto)){
         totalHoy += total;
      }

      if(p.fecha){
         const fechaPedido = new Date(p.fecha);
         if(fechaPedido >= hace7Dias){
            ventasSemana += total;
         }
      }

   });

   const promedio = totalPedidos > 0 ? totalGeneral / totalPedidos : 0;

   document.getElementById("totalPedidos").innerText = totalPedidos;
   document.getElementById("totalPendientes").innerText = pendientes;
   document.getElementById("totalHoy").innerText = totalHoy.toLocaleString();
   document.getElementById("totalGeneral").innerText = totalGeneral.toLocaleString();
   document.getElementById("promedioPedido").innerText = promedio.toFixed(0).toLocaleString();
   document.getElementById("ventasSemana").innerText = ventasSemana.toLocaleString();

   //🛑 indicador rojo si hay pendientes
   const alerta = document.getElementById("alertaPendientes");
   if(pendientes > 0){
      alerta.innerHTML = " 🛑";
   }else{
      alerta.innerHTML = "";
   }

   const badge = document.getElementById("badgePedidos");

if(badge){
   badge.textContent = pendientes;
   badge.style.display = pendientes > 0 ? "inline-block" : "none";
  }
if(pendientes > 0){
   badge.classList.add("animar");
   setTimeout(()=> badge.classList.remove("animar"), 400);
  }
}


window.animarBadge = function(){
   const badge = document.getElementById("badgePedidos");
   if(!badge) return;

   badge.classList.add("rebote");

   setTimeout(()=>{
      badge.classList.remove("rebote");
   },600);
}


window.cambiarEstado = function(id, estado){
   let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

   const index = pedidos.findIndex(p => p.id == id);
   if(index !== -1){
      pedidos[index].estado = estado;
   }

   localStorage.setItem("pedidos", JSON.stringify(pedidos));
}


window.mostrarNotificacion = function(){
   const n = document.getElementById("notificacionFlotante");
   if(!n) return;

   n.classList.remove("ocultar");
   n.classList.add("mostrar");

   setTimeout(()=>{
      n.classList.remove("mostrar");
      n.classList.add("ocultar");
   },4000);
}


window.crearGraficaVentas = function(){

   const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
   const ahora = new Date();

   let etiquetas = [];
   let datos = [];

   if(tipoGrafica === "dia"){
      etiquetas = Array.from({length:24}, (_,i)=> i+"h");
      datos = Array(24).fill(0);

      pedidos.forEach(p=>{
         const fecha = new Date(p.fecha);
         if(fecha.toDateString() === ahora.toDateString()){
            datos[fecha.getHours()] += p.total || 0;
         }
      });
   }

   if(tipoGrafica === "semana"){
      etiquetas = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
      datos = Array(7).fill(0);

      pedidos.forEach(p=>{
         const fecha = new Date(p.fecha);
         const dia = (fecha.getDay()+6)%7;
         datos[dia] += p.total || 0;
      });
   }

   if(tipoGrafica === "mes"){
      etiquetas = ["Sem1","Sem2","Sem3","Sem4","Sem5"];
      datos = Array(5).fill(0);

      pedidos.forEach(p=>{
         const fecha = new Date(p.fecha);
         if(fecha.getMonth() === ahora.getMonth()){
            const semana = Math.floor(fecha.getDate()/7);
            datos[semana] += p.total || 0;
         }
      });
   }

   if(tipoGrafica === "anio"){
      etiquetas = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
      datos = Array(12).fill(0);

      pedidos.forEach(p=>{
         const fecha = new Date(p.fecha);
         datos[fecha.getMonth()] += p.total || 0;
      });
   }

   const ctx = document.getElementById("graficaVentas").getContext("2d");

   if(window.miGrafica){
      window.miGrafica.destroy();
   }

   const gradient = ctx.createLinearGradient(0,0,0,300);
   gradient.addColorStop(0,"rgba(0,123,255,0.4)");
   gradient.addColorStop(1,"rgba(0,123,255,0)");

   window.miGrafica = new Chart(ctx,{
      type:"line",
      data:{
         labels: etiquetas,
         datasets:[{
            label:"Ventas $",
            data: datos,
            tension:0.4,
            fill:true,
            backgroundColor: gradient,
            borderColor:"#007bff",
            pointBackgroundColor:"#007bff",
            pointRadius:5,
            pointHoverRadius:7,
         }]
      },
      options:{
         responsive:true,
         plugins:{
            legend:{display:false}
         },
         scales:{
            y:{
               beginAtZero:true,
               grid:{color:"#eee"}
            },
            x:{
               grid:{display:false}
            }
         }
      }
   });

}


window.cambiarGrafica = function(tipo, boton){

   tipoGrafica = tipo;

   // quitar activo
   document.querySelectorAll(".filtros-grafica button")
      .forEach(btn => btn.classList.remove("activo"));

   // activar botón clickeado
   boton.classList.add("activo");

   crearGraficaVentas(); // 🔥 REDIBUJA
}


window.compararMeses = function(ventas){
   const hoy = new Date();
   const mesActual = hoy.getMonth();
   const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;

   const actual = ventas[mesActual];
   const anterior = ventas[mesAnterior];

   const texto = document.getElementById("comparacionMes");

   if(anterior === 0 && actual === 0){
      texto.innerHTML = "Sin ventas registradas aún";
      return;
   }

   const diferencia = actual - anterior;
   const porcentaje = anterior ? ((diferencia / anterior) * 100).toFixed(1) : 100;

   if(diferencia > 0){
      texto.innerHTML = `📈 Ventas subieron ${porcentaje}% respecto al mes pasado`;
      texto.style.color = "green";
   } else if(diferencia < 0){
      texto.innerHTML = `📉 Ventas bajaron ${Math.abs(porcentaje)}% respecto al mes pasado`;
      texto.style.color = "red";
   } else {
      texto.innerHTML = "Ventas iguales al mes anterior";
      texto.style.color = "black";
   }
}

let tipoGrafica = "semana";


window.cambiarTema = function(){

   const body = document.body;
   const sw = document.getElementById("switchTema");
   const circle = sw.querySelector(".switch-circle");
   const text = sw.querySelector(".switch-text");

   body.classList.toggle("modo-oscuro");

   if(body.classList.contains("modo-oscuro")){
      sw.classList.remove("claro");
      sw.classList.add("oscuro");
      circle.innerHTML = "🌙";
      text.textContent = "NIGHT MODE";
      localStorage.setItem("tema","oscuro");
   }else{
      sw.classList.remove("oscuro");
      sw.classList.add("claro");
      circle.innerHTML = "☀️";
      text.textContent = "DAY MODE";
      localStorage.setItem("tema","claro");
   }
}


let audioHabilitado = false;

document.addEventListener("click", () => {
   audioHabilitado = true;
}, { once:true });

window.reproducirSonido = function(){
   if(!audioHabilitado) return;

   const sonido = document.getElementById("sonidoPedido");
   if(sonido){
      sonido.volume = volumenActual;
      sonido.currentTime = 0;
      sonido.play().catch(()=>{});
   }
}

let volumenActual = localStorage.getItem("volumenPanel") || 0.7;

const control = document.getElementById("controlVolumen");

if(control){
   control.value = volumenActual;

   control.addEventListener("input", e=>{
      volumenActual = e.target.value;
      localStorage.setItem("volumenPanel", volumenActual);
   });
}


window.mostrarToast = function(){
   const t = document.getElementById("toastPedido");
   if(!t) return;

   t.classList.add("mostrar");

   setTimeout(()=>{
      t.classList.remove("mostrar");
   }, 3500);
}


window.actualizarTituloNavegador = function(){
   const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
   const pendientes = pedidos.filter(p=>p.estado==="pendiente").length;

   if(pendientes > 0){
      document.title = `(${pendientes}) Panel Administración`;
   } else {
      document.title = "Panel Administración";
   }
}


window.refrescarPanel = function(){
   cargarPedidos();
   actualizarEstadisticas();
   crearGraficaVentas();
   detectarPedidosNuevos(); // ✅ aquí sí
}


// Auto refresh cada 5 segundos
document.addEventListener("DOMContentLoaded", () => {

   cargarPedidos();
   actualizarEstadisticas();

   // activar botón semanal manualmente
   const botonInicial = document.querySelector(".filtros-grafica button.activo");

   if(botonInicial){
      crearGraficaVentas();
   }

});


window.addEventListener("load", ()=>{

   const tema = localStorage.getItem("tema");
   const sw = document.getElementById("switchTema");
   const circle = sw.querySelector(".switch-circle");
   const text = sw.querySelector(".switch-text");

   if(tema === "oscuro"){
      document.body.classList.add("modo-oscuro");
      sw.classList.add("oscuro");
      circle.innerHTML = "🌙";
      text.textContent = "NIGHT MODE";
   }else{
      sw.classList.add("claro");
      circle.innerHTML = "☀️";
      text.textContent = "DAY MODE";
   }
});
setInterval(refrescarPanel, 2000);


const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "admin-login.html";
    });
  });
}


