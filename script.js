let estudiantes = [];
let selectGlobalGrade = "";
let activeStudentIndex = null;

// Catálogos obligatorios de clases por nivel
const clasesBasicos = [
    "Matemáticas",
    "Lengua y Literatura",
    "Sociales",
    "Ciencias",
    "Expresión Artística",
    "Educación Física",
    "Educación Cristiana",
    "Contabilidad",
    "Lectura",
    "Progrentis",
    "Computación"
];

const clasesBachillerato = [
    "Matemática",
    "Matemática Aplicada",
    "Lengua y Literatura",
    "Biología",
    "Química",
    "Educación Cristiana",
    "Sociales",
    "Ética",
    "Estadística",
    "Física",
    "Computación",
    "Reparación y Soporte Técnico",
    "Contenidos Digitales"
];

// Inicio de la aplicación
document.addEventListener("DOMContentLoaded", () => {
    initMockData();
});

// Guardar y Registrar Estudiante
document.getElementById("student-form").addEventListener("submit", (e) => {

    e.preventDefault();

    const clave = document.getElementById("student-code").value.trim();

    let nombre = document.getElementById("student-name").value.trim();
    let apellido = document.getElementById("student-lastname").value.trim();

    const edad = parseInt(
        document.getElementById("student-age").value
    );

    const correo = document
        .getElementById("student-email")
        .value
        .trim();

    const telefono = document
        .getElementById("student-phone")
        .value
        .trim();

    const direccion = document
        .getElementById("student-address")
        .value
        .trim();

    const grado = document
        .getElementById("student-grade")
        .value;

    const seccion = document
        .getElementById("student-section")
        .value;

    // VALIDACIONES

    if (!correo.includes("@")) {
        alert("El correo debe contener @");
        return;
    }

    if (!/^[0-9]{8}$/.test(telefono)) {
        alert("El teléfono debe tener exactamente 8 dígitos");
        return;
    }

    if (edad < 5 || edad > 100) {
        alert("La edad debe estar entre 5 y 100 años");
        return;
    }

    if (direccion === "") {
        alert("La dirección es obligatoria");
        return;
    }

    const correoExiste = estudiantes.some(
        est => est.correo === correo
    );

    if (correoExiste) {
        alert("Ya existe un estudiante con ese correo");
        return;
    }

    nombre = nombre.toUpperCase();
    apellido = apellido.toUpperCase();

    const nombreCompleto = `${nombre} ${apellido}`;

    let materiasBase =
        grado.toLowerCase().includes("basico")
            ? [...clasesBasicos]
            : [...clasesBachillerato];

    let notasBase =
        new Array(materiasBase.length).fill(0);

    const nuevoEstudiante = {
        clave,
        nombre: nombreCompleto,
        edad,
        correo,
        telefono,
        direccion,
        grado,
        seccion,
        clases: materiasBase,
        notas: notasBase
    };

    estudiantes.push(nuevoEstudiante);

    document.getElementById("student-form").reset();

    selectGrade(grado);
});

// Filtrar listado lateral por grado seleccionado
function selectGrade(grado) {

    selectGlobalGrade = grado;

    const items =
        document.querySelectorAll(".grade-item");

    items.forEach(item => {

        if (
            item.innerText
                .toLowerCase()
                .includes(
                    grado.substring(0, 5).toLowerCase()
                )
        ) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    const container =
        document.getElementById(
            "students-list-container"
        );

    container.innerHTML = "";

    const filtrados =
        estudiantes.filter(
            est => est.grado === grado
        );

    if (filtrados.length === 0) {

        container.innerHTML =
            `<span style="color:#999;font-size:12px;display:block;padding:5px;">
            Sin alumnos inscritos
            </span>`;

        return;
    }

    filtrados.forEach(est => {

        const indexOriginal =
            estudiantes.indexOf(est);

        const div =
            document.createElement("div");

        div.className = "student-li";

        div.innerText =
            `${est.clave} - ${est.nombre}`;

        div.onclick =
            () => loadStudentDetails(indexOriginal);

        container.appendChild(div);

    });

}

// Cargar la ficha técnica del alumno
function loadStudentDetails(index) {

    activeStudentIndex = index;

    document.getElementById(
        "no-student-selected"
    ).style.display = "none";

    document.getElementById(
        "student-details-panel"
    ).style.display = "block";

    renderStudentMetrics();
}
// Calcular promedios, aprobación y pintar tabla
function renderStudentMetrics() {

    if (activeStudentIndex === null) return;

    const est = estudiantes[activeStudentIndex];

    let suma = 0;

    est.notas.forEach(nota => {
        suma += nota;
    });

    let promedio =
        est.notas.length > 0
            ? Math.round(suma / est.notas.length)
            : 0;

    const aprobado = promedio >= 61;

    document.getElementById("view-name").innerText =
        est.nombre;

    document.getElementById("view-grade").innerText =
        `${est.grado} - Sección: ${est.seccion}`;

    document.getElementById("view-average").innerText =
        promedio;

    const statusBadge =
        document.getElementById("view-status");

    statusBadge.className =
        `badge badge-${aprobado}`;

    statusBadge.innerText =
        aprobado
            ? "Aprobado"
            : "Reprobado";

    const tbody =
        document.getElementById(
            "clases-table-body"
        );

    tbody.innerHTML = "";

    est.clases.forEach((clase, i) => {

        const notaActual =
            est.notas[i] !== undefined
                ? est.notas[i]
                : 0;

        const tr =
            document.createElement("tr");

        tr.innerHTML = `
            <td>
                <strong>${clase}</strong>
            </td>

            <td>
                <input
                    type="number"
                    class="input-nota"
                    value="${notaActual}"
                    min="0"
                    max="100"
                    onchange="updateNotaManual(${i}, this.value)">
            </td>
        `;

        tbody.appendChild(tr);

    });

}

// Actualizar nota
function updateNotaManual(indexNota, valor) {

    if (activeStudentIndex === null) return;

    let nuevaNota = parseInt(valor);

    if (isNaN(nuevaNota) || nuevaNota < 0) {
        nuevaNota = 0;
    }

    if (nuevaNota > 100) {
        nuevaNota = 100;
    }

    estudiantes[activeStudentIndex]
        .notas[indexNota] = nuevaNota;

    renderStudentMetrics();
}

// Agregar nueva materia
function addNewClassToStudent() {

    if (activeStudentIndex === null) return;

    const inputNombreMateria =
        document.getElementById(
            "new-class-name"
        );

    const inputNotaMateria =
        document.getElementById(
            "new-class-nota"
        );

    const nombreMateria =
        inputNombreMateria.value.trim();

    let notaMateria =
        parseInt(
            inputNotaMateria.value
        );

    if (nombreMateria === "") {

        alert(
            "Por favor, escribe el nombre de la materia."
        );

        return;
    }

    if (
        isNaN(notaMateria)
        || notaMateria < 0
    ) {
        notaMateria = 0;
    }

    if (notaMateria > 100) {
        notaMateria = 100;
    }

    estudiantes[activeStudentIndex]
        .clases.push(nombreMateria);

    estudiantes[activeStudentIndex]
        .notas.push(notaMateria);

    inputNombreMateria.value = "";
    inputNotaMateria.value = "0";

    renderStudentMetrics();
}

// Eliminar estudiante
function deleteActiveStudent() {

    if (activeStudentIndex === null) return;

    const est =
        estudiantes[activeStudentIndex];

    const confirmar =
        confirm(
            `¿Estás seguro de eliminar a ${est.nombre}?`
        );

    if (confirmar) {

        estudiantes.splice(
            activeStudentIndex,
            1
        );

        activeStudentIndex = null;

        document.getElementById(
            "student-details-panel"
        ).style.display = "none";

        document.getElementById(
            "no-student-selected"
        ).style.display = "flex";

        selectGrade(selectGlobalGrade);

    }

}

// Editar estudiante
function editActiveStudent() {

    if (activeStudentIndex === null) return;

    const est =
        estudiantes[activeStudentIndex];

    const nuevoNombre =
        prompt(
            "Nuevo nombre:",
            est.nombre
        );

    if (
        nuevoNombre &&
        nuevoNombre.trim() !== ""
    ) {

        est.nombre =
            nuevoNombre.toUpperCase();

    }

    const nuevoGrado =
        prompt(
            "Nuevo grado:",
            est.grado
        );

    if (
        nuevoGrado &&
        nuevoGrado.trim() !== ""
    ) {

        est.grado = nuevoGrado;

    }

    const nuevaSeccion =
        prompt(
            "Nueva sección:",
            est.seccion
        );

    if (
        nuevaSeccion &&
        nuevaSeccion.trim() !== ""
    ) {

        est.seccion =
            nuevaSeccion;

    }

    renderStudentMetrics();

    selectGrade(est.grado);

}

// Buscar estudiante
function searchStudent() {

    const texto =
        document.getElementById(
            "search-student"
        )
        .value
        .toLowerCase();

    const alumnos =
        document.querySelectorAll(
            ".student-li"
        );

    alumnos.forEach(item => {

        if (
            item.innerText
                .toLowerCase()
                .includes(texto)
        ) {

            item.style.display =
                "block";

        } else {

            item.style.display =
                "none";

        }

    });

}

// Generar reporte
function generateReport() {

    if (activeStudentIndex === null) return;

    const est =
        estudiantes[activeStudentIndex];

    let suma = 0;

    est.notas.forEach(n => {
        suma += n;
    });

    const promedio =
        Math.round(
            suma / est.notas.length
        );

    alert(
`REPORTE DEL ESTUDIANTE

Nombre: ${est.nombre}
Código: ${est.clave}
Grado: ${est.grado}
Sección: ${est.seccion}

Promedio General: ${promedio}`
    );

}

// Datos iniciales
function initMockData() {

    estudiantes = [

        {
            clave: "AV-204",
            nombre: "FERNANDO JOSÉ MARROQUÍN",
            edad: 14,
            correo: "fernando@gmail.com",
            telefono: "12345678",
            direccion: "Chimaltenango",
            grado: "1ro Basico",
            seccion: "A",
            clases: [...clasesBasicos],
            notas: [75, 80, 65, 90, 85, 100, 70, 80, 65, 90, 85]
        },

        {
            clave: "AV-510",
            nombre: "GLENDA MARÍA ALVAREZ",
            edad: 17,
            correo: "glenda@gmail.com",
            telefono: "87654321",
            direccion: "Chimaltenango",
            grado: "4to bachillerato en computacion",
            seccion: "N/A",
            clases: [...clasesBachillerato],
            notas: [90, 85, 95, 70, 80, 100, 90, 85, 95, 70, 80, 90, 85]
        }

    ];

    selectGrade("1ro Basico");

}
