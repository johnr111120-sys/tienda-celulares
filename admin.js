  <script>
let productos = JSON.parse(localStorage.getItem("productos")) || [];

function cargarAdmin(){
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

function editar(id,campo,valor){
   const p = productos.find(x=>x.id==id);
   p[campo] = valor;
   guardar();
}

function eliminar(id){
   productos = productos.filter(p=>p.id!=id);
   guardar();
   cargarAdmin();
}

function nuevoProducto(){
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

function guardar(){
   localStorage.setItem("productos", JSON.stringify(productos));
}

cargarAdmin();

function cargarPedidos(){

   const cont = document.getElementById("listaPedidos");
   if(!cont) return;

   const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

   cont.innerHTML = "";

   pedidos.reverse().forEach(p => {

      cont.innerHTML += `
         <div class="pedido-card">
            <b>Pedido #${p.id}</b><br>
            ${p.fecha}<br>
            Total: $${p.total}<br>

            Estado:
            <select onchange="cambiarEstado(${p.id}, this.value)">
               <option ${p.estado=="pendiente"?"selected":""}>pendiente</option>
               <option ${p.estado=="enviado"?"selected":""}>enviado</option>
               <option ${p.estado=="entregado"?"selected":""}>entregado</option>
            </select>
         </div>
      `;
   });
}

function cambiarEstado(id, estado){
   let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

   const pedido = pedidos.find(p => p.id === id);
   pedido.estado = estado;

   localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

console.log("Pedidos cargados");
cargarPedidos();

</script> 
