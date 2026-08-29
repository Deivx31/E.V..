// ======================================================
// E.V.
// ASISTENTE ESCOLAR
// ======================================================


// ======================================================
// HORARIO
// ======================================================

const horario = {

    lunes: [
        ["Rep. Motores gasolina", "01:00 PM", "01:50 PM"],
        ["Rep. Motores gasolina", "01:50 PM", "02:40 PM"],
        ["Rep. Motores gasolina", "02:40 PM", "03:30 PM"],
        ["Rep. Motores gasolina", "03:30 PM", "04:20 PM"],
        ["Rep. Motores gasolina", "04:20 PM", "05:10 PM"],
        ["Rep. Motores gasolina", "05:10 PM", "06:00 PM"],
        ["Rep. Motores gasolina", "06:00 PM", "06:50 PM"]
    ],

    martes: [
        ["Rep. Carroceria", "01:00 PM", "01:50 PM"],
        ["Rep. Carroceria", "01:50 PM", "02:40 PM"],
        ["Rep. Carroceria", "02:40 PM", "03:30 PM"],
        ["Rep. Carroceria", "03:30 PM", "04:20 PM"],
        ["Inglés", "04:20 PM", "05:10 PM"],
        ["Bioética", "05:10 PM", "06:00 PM"],
        ["Bioética", "06:00 PM", "06:50 PM"]
    ],

    miercoles: [
        ["Matemáticas", "01:00 PM", "01:50 PM"],
        ["Matemáticas", "01:50 PM", "02:40 PM"],
        ["Química", "02:40 PM", "03:30 PM"],
        ["Clase libre", "03:30 PM", "04:20 PM"],
        ["Inglés", "04:20 PM", "05:10 PM"],
        ["Artes", "05:10 PM", "06:00 PM"],
        ["Artes", "06:00 PM", "06:50 PM"],
        ["Bioética", "06:50 PM", "07:40 PM"]
    ],

    jueves: [
        ["Matemáticas", "01:00 PM", "01:50 PM"],
        ["Matemáticas", "01:50 PM", "02:40 PM"],
        ["Autotrónica", "02:40 PM", "03:30 PM"],
        ["Autotrónica", "03:30 PM", "04:20 PM"],
        ["Autotrónica", "04:20 PM", "05:10 PM"],
        ["Autotrónica", "05:10 PM", "06:00 PM"],
        ["Autotrónica", "06:00 PM", "06:50 PM"]
    ],

    viernes: [
        ["Matemáticas", "01:00 PM", "01:50 PM"],
        ["Química", "01:50 PM", "02:40 PM"],
        ["Química", "02:40 PM", "03:30 PM"],
        ["Química", "03:30 PM", "04:20 PM"],
        ["Inglés", "04:20 PM", "05:10 PM"],
        ["Inglés", "05:10 PM", "06:00 PM"],
        ["Inglés", "06:00 PM", "06:50 PM"]
    ]

};


// ======================================================
// VARIABLES
// ======================================================

let tareas =
    JSON.parse(
        localStorage.getItem("ev_tareas")
    ) || [];

let siguienteID =
    Number(
        localStorage.getItem("ev_siguiente_id")
    ) || 1;

let filtroActual = "pendientes";

let diaSeleccionado = null;

let reconocimientoActivo = false;

let temporizadorMensaje = null;


// ======================================================
// DIAS
// ======================================================

const nombresDias = [

    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado"

];


// ======================================================
// GUARDAR DATOS
// ======================================================

function guardarDatos() {

    localStorage.setItem(
        "ev_tareas",
        JSON.stringify(tareas)
    );

    localStorage.setItem(
        "ev_siguiente_id",
        siguienteID
    );

}


// ======================================================
// NORMALIZAR TEXTO
// ======================================================

function normalizarTexto(texto) {

    return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

}


// ======================================================
// ESCAPAR HTML
// ======================================================

function escaparHTML(texto) {

    return String(texto)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ======================================================
// FECHA Y SALUDO
// ======================================================

function actualizarFecha() {

    const ahora = new Date();


    const elementoFecha =
        document.getElementById("fecha");


    if (elementoFecha) {

        let texto =
            ahora.toLocaleDateString(
                "es-MX",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        texto =
            texto.charAt(0).toUpperCase()
            +
            texto.slice(1);


        elementoFecha.textContent =
            texto;

    }


    let saludo;


    if (ahora.getHours() < 12) {

        saludo =
            "Buenos días";

    } else if (ahora.getHours() < 19) {

        saludo =
            "Buenas tardes";

    } else {

        saludo =
            "Buenas noches";

    }


    const elementoSaludo =
        document.getElementById("saludo");


    if (elementoSaludo) {

        elementoSaludo.textContent =
            saludo + ", David";

    }

}


// ======================================================
// DIA ACTUAL
// ======================================================

function obtenerDiaActual() {

    return nombresDias[
        new Date().getDay()
    ];

}


// ======================================================
// CONVERTIR HORA
// ======================================================

function convertirHora(horaTexto) {

    const partes =
        horaTexto.trim().split(" ");


    const tiempo =
        partes[0];


    const periodo =
        partes[1]
            ? partes[1].toUpperCase()
            : "PM";


    let [hora, minutos] =
        tiempo
            .split(":")
            .map(Number);


    if (
        periodo === "AM"
        &&
        hora === 12
    ) {

        hora = 0;

    }


    if (
        periodo === "PM"
        &&
        hora !== 12
    ) {

        hora += 12;

    }


    return (
        hora * 60
        +
        minutos
    );

}


// ======================================================
// HORARIO DE HOY
// ======================================================

function obtenerHorarioHoy() {

    return horario[
        obtenerDiaActual()
    ] || [];

}


// ======================================================
// MOSTRAR HORARIO DE HOY
// ======================================================

function mostrarHorarioHoy() {

    const contenedor =
        document.getElementById("horarioHoy");


    if (!contenedor) return;


    const lista =
        obtenerHorarioHoy();


    contenedor.innerHTML = "";


    if (lista.length === 0) {

        contenedor.innerHTML = `

            <div class="clase">

                <div class="clase-nombre">
                    Sin clase
                </div>

            </div>

        `;

        return;

    }


    lista.forEach(
        clase => {

            contenedor.innerHTML += `

                <div class="clase">

                    <div class="clase-hora">

                        ${clase[1]}

                    </div>

                    <div>

                        <div class="clase-nombre">

                            ${escaparHTML(clase[0])}

                        </div>

                        <div class="clase-horario">

                            ${clase[1]} — ${clase[2]}

                        </div>

                    </div>

                </div>

            `;

        }
    );

}


// ======================================================
// CLASE ACTUAL
// ======================================================

function actualizarClase() {

    const lista =
        obtenerHorarioHoy();


    const ahora =
        new Date();


    const minutosActuales =
        ahora.getHours() * 60
        +
        ahora.getMinutes();


    let claseActual = null;

    let siguienteClase = null;

    let indiceActual = -1;


    for (
        let i = 0;
        i < lista.length;
        i++
    ) {

        const inicio =
            convertirHora(lista[i][1]);

        const fin =
            convertirHora(lista[i][2]);


        if (

            minutosActuales >= inicio

            &&

            minutosActuales < fin

        ) {

            claseActual =
                lista[i];

            indiceActual =
                i;

            siguienteClase =
                lista[i + 1] || null;

            break;

        }


        if (

            minutosActuales < inicio

            &&

            siguienteClase === null

        ) {

            siguienteClase =
                lista[i];

        }

    }


    const estado =
        document.getElementById("estadoClase");

    const titulo =
        document.getElementById("claseActual");

    const hora =
        document.getElementById("horaClase");

    const siguiente =
        document.getElementById("siguienteClase");

    const progreso =
        document.getElementById("progreso");

    const numero =
        document.getElementById("numeroClase");


    if (
        !estado ||
        !titulo ||
        !hora ||
        !siguiente ||
        !progreso ||
        !numero
    ) {

        return;

    }


    if (claseActual) {

        estado.textContent =
            "CLASE ACTUAL";

        titulo.textContent =
            claseActual[0];

        hora.textContent =
            `${claseActual[1]} — ${claseActual[2]}`;

        numero.textContent =
            String(
                indiceActual + 1
            ).padStart(
                2,
                "0"
            );


        if (siguienteClase) {

            siguiente.textContent =
                `Después: ${siguienteClase[0]} · ${siguienteClase[1]}`;

        } else {

            siguiente.textContent =
                "Última clase del día";

        }


        const inicio =
            convertirHora(claseActual[1]);

        const fin =
            convertirHora(claseActual[2]);


        const porcentaje =
            (
                (minutosActuales - inicio)
                /
                (fin - inicio)
            ) * 100;


        progreso.style.width =
            Math.max(
                0,
                Math.min(
                    100,
                    porcentaje
                )
            ) + "%";

    }

    else {

        estado.textContent =
            "SIN CLASE";

        titulo.textContent =
            "Sin clase";

        numero.textContent =
            "--";

        progreso.style.width =
            "0%";


        if (siguienteClase) {

            siguiente.textContent =
                `Próxima: ${siguienteClase[0]} · ${siguienteClase[1]}`;

            hora.textContent =
                siguienteClase[1];

        }

        else {

            siguiente.textContent =
                lista.length === 0
                    ? "Hoy no tienes clases"
                    : "No hay más clases hoy";

            hora.textContent =
                "--";

        }

    }

}


// ======================================================
// ORDENAR TAREAS
// ======================================================

function ordenarTareas(a, b) {

    if (!a.fecha && !b.fecha) {

        return 0;

    }

    if (!a.fecha) {

        return 1;

    }

    if (!b.fecha) {

        return -1;

    }


    return (
        new Date(a.fecha)
        -
        new Date(b.fecha)
    );

}


// ======================================================
// FORMATEAR FECHA
// ======================================================

function formatearFecha(fechaTexto) {

    if (!fechaTexto) {

        return "Sin fecha";

    }


    const fecha =
        new Date(fechaTexto);


    if (isNaN(fecha.getTime())) {

        return "Sin fecha";

    }


    return fecha.toLocaleString(
        "es-MX",
        {

            weekday: "long",

            day: "numeric",

            month: "long",

            hour: "numeric",

            minute: "2-digit",

            hour12: true

        }
    );

}


// ======================================================
// CREAR HTML TAREA
// ======================================================

function crearHTMLTarea(tarea) {

    return `

        <div
            class="tarea ${
                tarea.completada
                    ? "tarea-completada"
                    : ""
            }"
        >

            <div class="tarea-top">

                <div>

                    <div class="tarea-materia">

                        ${escaparHTML(tarea.materia)}

                    </div>


                    <div class="tarea-nombre">

                        ${escaparHTML(tarea.nombre)}

                    </div>


                    <div class="tarea-fecha">

                        ${formatearFecha(tarea.fecha)}

                    </div>

                </div>


                <button
                    type="button"
                    class="completar"
                    onclick="cambiarEstadoTarea(${tarea.id})"
                    title="Completar tarea"
                >

                    ${
                        tarea.completada
                            ? "✓"
                            : "○"
                    }

                </button>

            </div>

        </div>

    `;

}


// ======================================================
// RENDERIZAR TAREAS
// ======================================================

function renderizarTareas() {

    const contenedorInicio =
        document.getElementById("tareas");

    const contenedorPanel =
        document.getElementById("tareasCompletas");

    const contador =
        document.getElementById("contadorTareas");


    const pendientes =
        tareas
            .filter(
                tarea =>
                    !tarea.completada
            )
            .sort(ordenarTareas);


    const completadas =
        tareas
            .filter(
                tarea =>
                    tarea.completada
            )
            .sort(ordenarTareas);


    if (contador) {

        contador.textContent =
            pendientes.length;

    }


    // INICIO

    if (contenedorInicio) {

        if (pendientes.length === 0) {

            contenedorInicio.innerHTML = `

                <div class="clase">

                    <div class="clase-nombre">
                        No tienes tareas pendientes
                    </div>

                </div>

            `;

        }

        else {

            contenedorInicio.innerHTML =
                pendientes
                    .slice(0, 5)
                    .map(crearHTMLTarea)
                    .join("");

        }

    }


    // PANEL

    if (contenedorPanel) {

        const lista =
            filtroActual === "pendientes"
                ? pendientes
                : completadas;


        if (lista.length === 0) {

            contenedorPanel.innerHTML = `

                <div class="clase">

                    <div class="clase-nombre">

                        ${
                            filtroActual === "pendientes"
                                ? "No tienes tareas pendientes"
                                : "No hay tareas completadas"
                        }

                    </div>

                </div>

            `;

        }

        else {

            contenedorPanel.innerHTML =
                lista
                    .map(crearHTMLTarea)
                    .join("");

        }

    }

}


// ======================================================
// CAMBIAR ESTADO TAREA
// ======================================================

function cambiarEstadoTarea(id) {

    const tarea =
        tareas.find(
            tarea =>
                tarea.id === Number(id)
        );


    if (!tarea) {

        return;

    }


    tarea.completada =
        !tarea.completada;


    guardarDatos();

    renderizarTareas();


    if (tarea.completada) {

        mostrarMensajeEV(
            `Tarea completada: ${tarea.nombre}`
        );

    }

    else {

        mostrarMensajeEV(
            `Tarea pendiente nuevamente: ${tarea.nombre}`
        );

    }

}


// ======================================================
// FILTROS
// ======================================================

function cambiarFiltroTareas(filtro) {

    filtroActual =
        filtro;


    const pendientes =
        document.getElementById(
            "filtroPendientes"
        );

    const completadas =
        document.getElementById(
            "filtroCompletadas"
        );


    if (pendientes) {

        pendientes.classList.toggle(
            "activo",
            filtro === "pendientes"
        );

    }


    if (completadas) {

        completadas.classList.toggle(
            "activo",
            filtro === "completadas"
        );

    }


    renderizarTareas();

}


// ======================================================
// PANEL HORARIO
// ======================================================

function mostrarHorario() {

    cerrarTodosLosPaneles();


    const panel =
        document.getElementById(
            "panelHorario"
        );


    if (panel) {

        panel.classList.add(
            "activo"
        );

    }


    const diaActual =
        obtenerDiaActual();


    diaSeleccionado =
        horario[diaActual]
            ? diaActual
            : "lunes";


    cambiarDia(
        diaSeleccionado
    );

}


// ======================================================
// CAMBIAR DIA
// ======================================================

function cambiarDia(dia) {

    diaSeleccionado =
        dia;


    const botones =
        document.querySelectorAll(
            ".dias button"
        );


    botones.forEach(
        boton => {

            boton.classList.toggle(
                "activo",
                boton.dataset.dia === dia
            );

        }
    );


    const contenedor =
        document.getElementById(
            "horarioCompleto"
        );


    if (!contenedor) {

        return;

    }


    const lista =
        horario[dia] || [];


    if (lista.length === 0) {

        contenedor.innerHTML = `

            <div class="clase">

                <div class="clase-nombre">
                    Sin clase
                </div>

            </div>

        `;

        return;

    }


    contenedor.innerHTML =
        lista
            .map(
                (clase, indice) => `

                    <div class="clase">

                        <div class="clase-hora">

                            ${String(indice + 1).padStart(2, "0")}

                        </div>

                        <div>

                            <div class="clase-nombre">

                                ${escaparHTML(clase[0])}

                            </div>

                            <div class="clase-horario">

                                ${clase[1]} — ${clase[2]}

                            </div>

                        </div>

                    </div>

                `
            )
            .join("");

}


// ======================================================
// MOSTRAR TAREAS
// ======================================================

function mostrarTareas() {

    cerrarTodosLosPaneles();


    const panel =
        document.getElementById(
            "panelTareas"
        );


    if (panel) {

        panel.classList.add(
            "activo"
        );

    }


    cambiarFiltroTareas(
        filtroActual
    );

}


// ======================================================
// CERRAR PANELES
// ======================================================

function cerrarTodosLosPaneles() {

    const panelHorario =
        document.getElementById(
            "panelHorario"
        );

    const panelTareas =
        document.getElementById(
            "panelTareas"
        );

    if (panelHorario) {

        panelHorario.classList.remove(
            "activo"
        );

    }

    if (panelTareas) {

        panelTareas.classList.remove(
            "activo"
        );

    }

}


// ======================================================
// CERRAR PANEL
// ======================================================

function cerrarPanel() {

    cerrarTodosLosPaneles();

}


// ======================================================
// IR A INICIO
// ======================================================

function irInicio() {

    cerrarTodosLosPaneles();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    actualizarNavegacion(
        "inicio"
    );

}


// ======================================================
// CAMBIAR FILTRO DE TAREAS
// ======================================================

function cambiarFiltroTareas(
    filtro
) {

    filtroActual =
        filtro;


    const pendientes =
        document.getElementById(
            "filtroPendientes"
        );

    const completadas =
        document.getElementById(
            "filtroCompletadas"
        );


    if (pendientes) {

        pendientes.classList.toggle(
            "activo",
            filtro === "pendientes"
        );

    }


    if (completadas) {

        completadas.classList.toggle(
            "activo",
            filtro === "completadas"
        );

    }


    renderizarTareas();

}


// ======================================================
// NUEVA TAREA
// ======================================================

function nuevaTarea() {

    const nombre =
        prompt(
            "¿Qué tarea tienes que hacer?"
        );


    if (
        !nombre ||
        !nombre.trim()
    ) {

        return;

    }


    const materia =
        prompt(
            "¿De qué materia es?"
        );


    if (
        !materia ||
        !materia.trim()
    ) {

        return;

    }


    const fechaTexto =
        prompt(
            "¿Cuándo se entrega? Ejemplo: mañana a las 6, viernes a las 7"
        );


    let fecha =
        null;


    if (
        fechaTexto &&
        fechaTexto.trim()
    ) {

        fecha =
            interpretarFecha(
                fechaTexto
            );

    }


    const nueva =
        {

            id:
                siguienteID++,

            nombre:
                nombre.trim(),

            materia:
                materia.trim(),

            fecha:
                fecha
                    ? fecha.toISOString()
                    : null,

            completada:
                false,

            recordatorio15:
                false,

            recordatorioDia:
                false,

            recordatorioVencida:
                false

        };


    tareas.push(
        nueva
    );


    guardarDatos();

    renderizarTareas();


    responderEV(
        fecha
            ? `Listo. Agregué ${nueva.nombre} de ${nueva.materia} para ${formatearFechaCompleta(fecha)}.`
            : `Listo. Agregué ${nueva.nombre} de ${nueva.materia}.`
    );

}


// ======================================================
// MOSTRAR HORARIO COMPLETO
// ======================================================

function mostrarHorario() {

    cerrarTodosLosPaneles();


    const panel =
        document.getElementById(
            "panelHorario"
        );


    if (panel) {

        panel.classList.add(
            "activo"
        );

    }


    const diaActual =
        new Date().getDay();


    const indice =
        diaActual === 0
            ? 0
            : diaActual - 1;


    cambiarDia(
        indice
    );

}


// ======================================================
// CAMBIAR DÍA
// ======================================================

function cambiarDia(
    indice
) {

    const dias =
        [
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes"
        ];


    const nombreDia =
        dias[indice];


    const lista =
        horario[nombreDia]
        || [];


    const contenedor =
        document.getElementById(
            "horarioCompleto"
        );


    if (!contenedor) return;


    contenedor.innerHTML =
        "";


    document
        .querySelectorAll(
            ".dias button"
        )
        .forEach(
            boton =>
                boton.classList.remove(
                    "activo"
                )
        );


    const botones =
        document.querySelectorAll(
            ".dias button"
        );


    if (
        botones[indice]
    ) {

        botones[indice].classList.add(
            "activo"
        );

    }


    if (
        lista.length === 0
    ) {

        contenedor.innerHTML = `

            <div class="clase">

                <div class="clase-nombre">
                    Sin clase
                </div>

            </div>

        `;

        return;

    }


    lista.forEach(
        (
            clase,
            numero
        ) => {

            contenedor.innerHTML += `

                <div class="clase">

                    <div class="clase-hora">

                        ${String(numero + 1)
                            .padStart(2, "0")}

                    </div>

                    <div>

                        <div class="clase-nombre">

                            ${escaparHTML(
                                clase[0]
                            )}

                        </div>

                        <div class="clase-horario">

                            ${clase[1]}
                            —
                            ${clase[2]}

                        </div>

                    </div>

                </div>

            `;

        }
    );

}


// ======================================================
// ACTIVAR E.V.
// ======================================================

function activarEV() {

    cerrarTodosLosPaneles();

    actualizarNavegacion(
        "ev"
    );


    const entrada =
        document.getElementById(
            "entradaTexto"
        );


    if (entrada) {

        entrada.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        setTimeout(
            () => {

                entrada.focus();

            },
            500
        );

    }


    responderTexto(
        "Estoy lista. Puedes escribirme o hablarme."
    );

}


// ======================================================
// ACTUALIZAR NAVEGACIÓN
// ======================================================

function actualizarNavegacion(
    seccion
) {

    const botones =
        document.querySelectorAll(
            ".nav button"
        );


    botones.forEach(
        boton =>
            boton.classList.remove(
                "nav-activo"
            )
    );


    if (
        seccion === "inicio"
        &&
        botones[0]
    ) {

        botones[0].classList.add(
            "nav-activo"
        );

    }


    if (
        seccion === "horario"
        &&
        botones[1]
    ) {

        botones[1].classList.add(
            "nav-activo"
        );

    }


    if (
        seccion === "tareas"
        &&
        botones[2]
    ) {

        botones[2].classList.add(
            "nav-activo"
        );

    }


    if (
        seccion === "ev"
        &&
        botones[3]
    ) {

        botones[3].classList.add(
            "nav-activo"
        );

    }

}


// ======================================================
// NOTIFICACIONES
// ======================================================

function solicitarNotificaciones() {

    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission === "default"
    ) {

        Notification.requestPermission()
            .catch(
                () => {}
            );

    }

}


function notificar(
    titulo,
    mensaje
) {

    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission !== "granted"
    ) {

        return;

    }


    try {

        new Notification(
            titulo,
            {
                body: mensaje,
                icon: ""
            }
        );

    } catch (error) {

        console.log(
            "Error en notificación:",
            error
        );

    }

}


// ======================================================
// REVISAR RECORDATORIOS
// ======================================================

function revisarRecordatorios() {

    const ahora =
        new Date();


    let huboCambios =
        false;


    tareas.forEach(
        tarea => {

            if (
                tarea.completada
                ||
                !tarea.fecha
            ) {

                return;

            }


            const entrega =
                new Date(
                    tarea.fecha
                );


            const diferencia =
                entrega.getTime()
                -
                ahora.getTime();


            const minutos =
                diferencia / 60000;


            // TAREA VENCIDA

            if (
                diferencia < 0
                &&
                !tarea.recordatorioVencida
            ) {

                tarea.recordatorioVencida =
                    true;

                huboCambios =
                    true;


                notificar(
                    "Tarea vencida",
                    `${tarea.nombre} de ${tarea.materia} ya venció.`
                );

            }


            // MENOS DE 15 MINUTOS

            else if (
                minutos > 0
                &&
                minutos <= 15
                &&
                !tarea.recordatorio15
            ) {

                tarea.recordatorio15 =
                    true;

                huboCambios =
                    true;


                notificar(
                    "Entrega próxima",
                    `${tarea.nombre} vence en menos de 15 minutos.`
                );

            }


            // RECORDATORIO EL MISMO DÍA

            else if (
                minutos > 15
                &&
                minutos <= 1440
                &&
                !tarea.recordatorioDia
            ) {

                tarea.recordatorioDia =
                    true;

                huboCambios =
                    true;


                notificar(
                    "Tarea para hoy",
                    `${tarea.nombre} de ${tarea.materia} se entrega hoy.`
                );

            }

        }
    );


    if (huboCambios) {

        guardarDatos();

    }

}


// ======================================================
// INICIAR E.V.
// ======================================================

function iniciarEV() {

    actualizarFecha();

    mostrarHorarioHoy();

    actualizarClase();

    renderizarTareas();


    // Actualizar cada minuto

    setInterval(
        function() {

            actualizarFecha();

            actualizarClase();

            revisarRecordatorios();

        },
        60000
    );


    // Revisar inmediatamente

    revisarRecordatorios();


    // Actualizar al volver a la aplicación

    document.addEventListener(
        "visibilitychange",
        function() {

            if (
                !document.hidden
            ) {

                actualizarFecha();

                actualizarClase();

                renderizarTareas();

                revisarRecordatorios();

            }

        }
    );

}


// ======================================================
// EVENTOS DE TECLADO
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const entrada =
            document.getElementById(
                "entradaTexto"
            );


        if (entrada) {

            entrada.addEventListener(
                "keydown",
                function(evento) {

                    if (
                        evento.key === "Enter"
                    ) {

                        evento.preventDefault();

                        procesarEntrada();

                    }

                }
            );

        }


        // Cargar voces

        if (
            "speechSynthesis" in window
        ) {

            window.speechSynthesis
                .getVoices();


            window.speechSynthesis
                .onvoiceschanged =
                function() {

                    window.speechSynthesis
                        .getVoices();

                };

        }


        iniciarEV();

    }
);


// ======================================================
// CLIC EN NAVEGACIÓN
// ======================================================

document.addEventListener(
    "click",
    function(evento) {

        const boton =
            evento.target.closest(
                ".nav button"
            );


        if (!boton) return;


        const texto =
            boton.textContent
                .trim()
                .toLowerCase();


        if (
            texto === "inicio"
        ) {

            actualizarNavegacion(
                "inicio"
            );

        }


        if (
            texto === "horario"
        ) {

            actualizarNavegacion(
                "horario"
            );

        }


        if (
            texto === "tareas"
        ) {

            actualizarNavegacion(
                "tareas"
            );

        }


        if (
            texto === "e.v."
            ||
            texto === "ev"
        ) {

            actualizarNavegacion(
                "ev"
            );

        }

    }
);

// ======================================================
// SERVICE WORKER
// ======================================================

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        function() {

            navigator.serviceWorker
                .register(
                    "./sw.js"
                )
                .then(
                    function(registro) {

                        console.log(
                            "E.V. lista como aplicación",
                            registro
                        );

                    }
                )
                .catch(
                    function(error) {

                        console.log(
                            "Error al registrar Service Worker:",
                            error
                        );

                    }
                );

        }
    );

}
