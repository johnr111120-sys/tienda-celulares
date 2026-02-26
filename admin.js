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
</script> 

  <script>
function editar(id,campo,valor){
   const p = productos.find(x=>x.id==id);
   p[campo] = valor;
   guardar();
}
</script> 

  <script>
function eliminar(id){
   productos = productos.filter(p=>p.id!=id);
   guardar();
   cargarAdmin();
}
</script> 

  <script>
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
</script> 

  <script>
function guardar(){
   localStorage.setItem("productos", JSON.stringify(productos));
}

cargarAdmin();
</script> 

  <script>
function cargarPedidos(){

   const cont = document.getElementById("listaPedidos");
   const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

   cont.innerHTML = "";

   if(pedidos.length === 0){
      cont.innerHTML = "<p>No hay pedidos aún</p>";
      return;
   }

  pedidos.slice().reverse().forEach(p => {

   cont.innerHTML += `
      <div class="pedido-card">
         <strong>Pedido #${p.id}</strong><br>
         Fecha: ${p.fecha}<br>
         Total: $${(p.total ?? 0).toLocaleString()}<br>
         Estado:

         <select onchange="cambiarEstado(${p.id}, this.value)">
            <option value="pendiente" ${p.estado==="pendiente"?"selected":""}>Pendiente</option>
            <option value="enviado" ${p.estado==="enviado"?"selected":""}>Enviado</option>
            <option value="entregado" ${p.estado==="entregado"?"selected":""}>Entregado</option>
         </select>
      </div>
   `;
});
</script> 

  <script>
function cambiarEstado(id, estado){
   let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

   const index = pedidos.findIndex(p => p.id == id);
   if(index !== -1){
      pedidos[index].estado = estado;
   }

   localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

console.log("Pedidos cargados");
cargarPedidos();

</script> 
