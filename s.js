document.addEventListener('DOMContentLoaded', () => {

    // Variables
    const articulos = [{id:1 ,nombre:"tenis clásico", descripcion:"Tennis en cuero blanco, con líneas Azules", precio: 20000, imagen:"https://reebokcol.vtexassets.com/arquivos/ids/702685-500-auto?v=638260161352430000&width=500&height=auto&aspect=true"},
    {id:2 ,nombre:"Clásico gris", descripcion:"Tennis en cuero blanco, con líneas grises", precio: 21000, imagen:"https://reebokcol.vtexassets.com/arquivos/ids/708103-500-auto?v=638260188600170000&width=500&height=auto&aspect=true"},
    {id:3 ,nombre:"Clásico bota", descripcion:"Tennis en bota sintetico, con líneas Azules,amarillas", precio: 20000, imagen:"https://reebokcol.vtexassets.com/arquivos/ids/790298-500-auto?v=638296361691970000&width=500&height=auto&aspect=true"},
    {id:4 ,nombre:"Tenis bota", descripcion:"blanco bota", precio: 25000, imagen:"https://reebokcol.vtexassets.com/arquivos/ids/787678-500-auto?v=638296348913300000&width=500&height=auto&aspect=true"},
    {id:5 ,nombre:"Tenis azúl", descripcion:"blanco azul", precio: 24000, imagen:"https://reebokcol.vtexassets.com/arquivos/ids/790718-500-auto?v=638296363948370000&width=500&height=auto&aspect=true"},
    {id:6 ,nombre:"Tenis rojo", descripcion:"blanco rojo", precio: 25000, imagen:"https://reebokcol.vtexassets.com/arquivos/ids/689782-500-auto?v=638260097470100000&width=500&height=auto&aspect=true"}
    ];

    let carro = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarro = document.querySelector('#carro');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;

    // Funciones


    function renderizar() {
        articulos.forEach((info) => {
          
            const nodo = document.createElement('div');
            nodo.classList.add('card', 'col-3', 'mx-auto');
            // Body
            const nodoTarjeta = document.createElement('div');
            nodoTarjeta.classList.add('card-body');
            // Titulo
            const nodoTitle = document.createElement('h5');
            nodoTitle.classList.add('card-title');
            nodoTitle.textContent = info.nombre;
            // Image
            const nodoImagen = document.createElement('img');
            nodoImagen.classList.add('img-fluid');
            nodoImagen.setAttribute('src', info.imagen);
            // Precio
            const nodoPrecio = document.createElement('p');
            nodoPrecio.classList.add('card-text');
            nodoPrecio.textContent = `${divisa} ${info.precio}`;
            // Btn Agregar
            const nodoBotonAgregar = document.createElement('button');
            nodoBotonAgregar.classList.add('btn', 'btn-primary');
            nodoBotonAgregar.textContent = '+';
            nodoBotonAgregar.setAttribute('sumar', info.id);
            nodoBotonAgregar.addEventListener('click', agregar);
            // Btn Retirar
            const nodoBotonRetirar = document.createElement('button');
            nodoBotonRetirar.classList.add('btn', 'btn-secondary');
            nodoBotonRetirar.textContent = '-';
            nodoBotonRetirar.setAttribute('restar', info.id);
            nodoBotonRetirar.addEventListener('click', retitar);

            // Insertar
            nodoTarjeta.appendChild(nodoImagen);
            nodoTarjeta.appendChild(nodoTitle);
            nodoTarjeta.appendChild(nodoPrecio);
            nodoTarjeta.appendChild(nodoBotonAgregar);
            nodoTarjeta.appendChild(nodoBotonRetirar);
            nodo.appendChild(nodoTarjeta);
            DOMitems.appendChild(nodo);
        });
    }
    /** Evento para añadir un producto al carro de la compra  */
    function agregar(evento) {
        // Añadimos el Nodo a nuestro carro
        carro.push(evento.target.getAttribute('sumar'))
        // Actualizamos el carro
        renderizarcarro();
        // Actualizamos el LocalStorage
        guardarcarroEnLocalStorage();
    }
    function retitar(evento) {
        alert("Retiro el producto  "+evento.target.getAttribute('restar'));
        console.log(" se va retirar del carro "+carro);
        let a =0;// cuando no ha encontrado el artículo
        console.log("Valor inicial de A "+a);
        let v=[];
        carro.forEach((element) =>{ console.log(element);
        
       evento.target.getAttribute('restar')!=element ? v.push(element) :"";
       (a==1)&& evento.target.getAttribute('restar')==element ? v.push(element) :"";
       evento.target.getAttribute('restar')==element ?   a=1 :"";
            
        }
        );
        carro=v;
        renderizarcarro();
    }


    function renderizarcarro() {
        DOMcarro.textContent = '';
        const carroSinDuplicados = [...new Set(carro)];
        
        carroSinDuplicados.forEach((item) => {
            const miItem = articulos.filter((itemBaseDatos) => {
                // Se verifica el id y que no se repita 
                return itemBaseDatos.id === parseInt(item);
            });
            // contardor número de veces que se repite el producto
            const numeroUnidadesItem = carro.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Se crea el nodo del item del carro
            const nodo = document.createElement('li');
            nodo.classList.add('list-group-item', 'text-right', 'mx-2');
            nodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} -${divisa} ${miItem[0].precio}`;
            // Boton de borrar o vaciar el carro
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'Eliminar';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemcarro);
            
            nodo.appendChild(miBoton);
            DOMcarro.appendChild(nodo);
        });
        
        DOMtotal.textContent = calcularTotal();
    }

    
    function borrarItemcarro(evento) {
        
        const id = evento.target.dataset.item;
        carro = carro.filter((carroId) => {
            return carroId !== id;
        });
        renderizarcarro();
        
        guardarcarroEnLocalStorage();

    }


    function calcularTotal() {
        
        return carro.reduce((total, item) => {
            
            const miItem = articulos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
           
            return total + miItem[0].precio;
        }, 0).toFixed(1);
    }

    function vaciarcarro() {
        
        carro = [];
        renderizarcarro();
        localStorage.clear();

    }

    function guardarcarroEnLocalStorage () {
        miLocalStorage.setItem('carro', JSON.stringify(carro));
    }

    function cargarcarroDeLocalStorage () {
       
        if (miLocalStorage.getItem('carro') !== null) {
            
            carro = JSON.parse(miLocalStorage.getItem('carro'));
        }
    }

 
    DOMbotonVaciar.addEventListener('click', vaciarcarro);


    cargarcarroDeLocalStorage();
    renderizar();
    renderizarcarro();
});