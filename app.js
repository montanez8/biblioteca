// variables 
const agregarLibroForm = document.getElementById("agregar-libro-form");
const tituloInput = document.getElementById("titulo");
const autorInput = document.getElementById("autor");
const anioInput = document.getElementById("anio");
const listaLibros = document.getElementById("lista-libros");
const ordenarPorSelect = document.getElementById("ordenar-por");


// arreglo de libros
let biblioteca = [];

// funciones
function agregarLibro(event) {
    event.preventDefault();
    const titulo = tituloInput.value;
    const autor = autorInput.value;
    const anio = anioInput.value;
    const portada = document.getElementById("portada").files[0];

    if (!portada) {
        alert("Por favor, seleccione una imagen para la portada del libro.");
        return;
    }

    // objeto libro
    const libro = {
        titulo,
        autor,
        anio,
        estado: "Disponible",
        prestadoA: null,
        portada
    };
    biblioteca.push(libro);
    actualizarListaLibros();


    const modal = new bootstrap.Modal(document.getElementById("modalAgregarLibro"));
    modal.hide();


    tituloInput.value = "";
    autorInput.value = "";
    anioInput.value = "";
    document.getElementById("portada").value = "";
}

function prestarLibro(index) {
    const lectorInput = document.querySelectorAll("input[type='text']")[index];
    const nombreLector = lectorInput.value;

    if (!nombreLector) {
        alert("Por favor, ingrese el nombre del lector.");
        return;
    }

    biblioteca[index].estado = "Prestado";
    biblioteca[index].prestadoA = nombreLector;
    actualizarListaLibros();

    lectorInput.value = "";
}

function devolverLibro(index) {
    biblioteca[index].estado = "Disponible";
    biblioteca[index].prestadoA = null;
    actualizarListaLibros();
}

function eliminarLibro(index) {
    if (confirm("¿Seguro que quieres eliminar este libro?")) {
        biblioteca.splice(index, 1);
        actualizarListaLibros();
    }
}

function actualizarListaLibros() {
    const criterioOrden = ordenarPorSelect.value;
    listaLibros.innerHTML = "";


    const compararLibros = (libroA, libroB) => {
        switch (criterioOrden) {
            case "titulo":
                return libroA.titulo.localeCompare(libroB.titulo);
            case "autor":
                return libroA.autor.localeCompare(libroB.autor);
            case "estado":
                return libroA.estado.localeCompare(libroB.estado);
            default:
                return 0; 
        }
    };

    biblioteca.sort(compararLibros);

    biblioteca.forEach((libro, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.style.width = "18rem";

        const img = document.createElement("img");
        img.src = URL.createObjectURL(libro.portada);
        img.classList.add("card-img-top");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = libro.titulo;

        const cardSubtitle = document.createElement("h6");
        cardSubtitle.classList.add("card-subtitle", "mb-2", "text-muted");
        cardSubtitle.textContent = `Autor: ${libro.autor}, Año: ${libro.anio}`;

        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = `Estado: ${libro.estado}`;

        const eliminarBtn = document.createElement("button");
        eliminarBtn.classList.add("btn", "btn-danger");
        eliminarBtn.textContent = "Eliminar";
        eliminarBtn.addEventListener("click", () => eliminarLibro(index));

        const devolverBtn = document.createElement("button");
        devolverBtn.classList.add("btn", "btn-success");
        devolverBtn.textContent = "Devolver";
        devolverBtn.addEventListener("click", () => devolverLibro(index));

        if (libro.estado === "Prestado") {
            cardText.textContent += ` - Prestado a: ${libro.prestadoA}`;
        }

        const prestarBtn = document.createElement("button");
        prestarBtn.classList.add("btn", "btn-primary");
        prestarBtn.textContent = "Prestar";
        prestarBtn.addEventListener("click", () => prestarLibro(index));

        const lectorInput = document.createElement("input");
        lectorInput.type = "text";
        lectorInput.classList.add("form-control");
        lectorInput.placeholder = "Nombre del Lector";
        lectorInput.style.marginTop = "10px";

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardSubtitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(lectorInput);
        cardBody.appendChild(prestarBtn);
        cardBody.appendChild(devolverBtn);
        cardBody.appendChild(eliminarBtn);
        card.appendChild(img);
        card.appendChild(cardBody);
        listaLibros.appendChild(card);
    });

    localStorage.setItem("ordenarPor", criterioOrden);
}

agregarLibroForm.addEventListener("submit", agregarLibro);
ordenarPorSelect.addEventListener("change", actualizarListaLibros);

const criterioOrdenGuardado = localStorage.getItem("ordenarPor");
if (criterioOrdenGuardado) {
    ordenarPorSelect.value = criterioOrdenGuardado;
}

actualizarListaLibros();
