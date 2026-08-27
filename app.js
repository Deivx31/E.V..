// ======================================================
// E.V.
// Asistente escolar de David
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
        ["Ingles", "04:20 PM", "05:10 PM"],
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
// TAREAS
// ======================================================

let tareas =
    JSON.parse(
        localStorage.getItem("ev_tareas")
    ) || [];

let filtroActual = "pendientes";

let siguienteID =
    Number(
        localStorage.getItem("ev_siguiente_id")
    ) || 1;


// ======================================================
// DÍAS
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
// GUARDAR
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
// FECHA
// ======================================================

function actualizarFecha() {

    const ahora = new Date();

    let fecha =
        ahora.toLocaleDateString(
            "es-MX",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    fecha =
        fecha.charAt(0).toUpperCase()
        +
        fecha.slice(1);


    const elemento =
        document.getElementById("fecha");

    if (elemento) {

        elemento.textContent =
            fecha;

    }


    let saludo;

    const hora =
        ahora.getHours();


    if (hora < 12) {

        saludo = "Buenos días";

    } else if (hora < 19) {

        saludo = "Buenas tardes";

    } else {

        saludo = "Buenas noches";

    }


    const saludoElemento =
        document.getElementById("saludo");


    if (saludoElemento) {

        saludoElemento.textContent =
            saludo + ", David";

    }

}


// ======================================================
// DÍA ACTUAL
// ======================================================

function obtenerDiaActual() {

    return nombresDias[
        new Date().getDay()
    ];

}


// ======================================================
// CONVERTIR HORA
// ======================================================

function convertirHora(hora) {

    const partes =
        hora.trim().split(" ");

    const tiempo =
        partes[0];

    const periodo =
        partes[1]
            ? partes[1].toUpperCase()
            : "PM";


    let [h, m] =
        tiempo
            .split(":")
            .map(Number);


    if (
        periodo === "AM"
        &&
        h === 12
    ) {

        h = 0;

    }


    if (
        periodo === "PM"
        &&
        h !== 12
    ) {

        h += 12;

    }


    return (
        h * 60
        +
        (m || 0)
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
// MOSTRAR HORARIO
// ======================================================

function mostrarHorarioHoy() {

    const contenedor =
        document.getElementById(
            "horarioHoy"
        );


    if (!contenedor) return;


    const lista =
        obtenerHorarioHoy();


    contenedor.innerHTML =
        "";


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
        clase => {

            contenedor.innerHTML += `

                <div class="clase">

                    <div class="clase-hora">
                        ${clase[1]}
                    </div>

                    <div>

                        <div class="clase-nombre">
                            ${clase[0]}
                        </div>

                        <div class="clase-horario">
                            Horario:
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
// CLASE ACTUAL
// ======================================================

function actualizarClase() {

    const lista =
        obtenerHorarioHoy();


    const ahora =
        new Date();


    const minutos =
        ahora.getHours() * 60
        +
        ahora.getMinutes();


    let actual = null;
    let siguiente = null;
    let indice = -1;


    for (
        let i = 0;
        i < lista.length;
        i++
    ) {

        const inicio =
            convertirHora(
                lista[i][1]
            );

        const fin =
            convertirHora(
                lista[i][2]
            );


        if (
            minutos >= inicio
            &&
            minutos < fin
        ) {

            actual =
                lista[i];

            indice =
                i;

            siguiente =
                lista[i + 1]
                ||
                null;

            break;

        }


        if (
            minutos < inicio
            &&
            siguiente === null
        ) {

            siguiente =
                lista[i];

        }

    }


    const estado =
        document.getElementById(
            "estadoClase"
        );

    const titulo =
        document.getElementById(
            "claseActual"
        );

    const hora =
        document.getElementById(
            "horaClase"
        );

    const siguienteElemento =
        document.getElementById(
            "siguienteClase"
        );

    const progreso =
        document.getElementById(
            "progreso"
        );

    const numero =
        document.getElementById(
            "numeroClase"
        );


    if (!estado) return;


    if (actual) {

        estado.textContent =
            "CLASE ACTUAL";

        titulo.textContent =
            actual[0];

        hora.textContent =
            `${actual[1]} — ${actual[2]}`;

        numero.textContent =
            String(indice + 1)
                .padStart(2, "0");


        if (siguiente) {

            siguienteElemento.textContent =
                `Después: ${siguiente[0]} · ${siguiente[1]}`;

        } else {

            siguienteElemento.textContent =
                "Última clase del día";

        }


        const inicio =
            convertirHora(actual[1]);

        const fin =
            convertirHora(actual[2]);


        const porcentaje =
            (
                (minutos - inicio)
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


    } else {

        estado.textContent =
            "SIN CLASE";

        titulo.textContent =
            "Sin clase";

        numero.textContent =
            "--";

        progreso.style.width =
            "0%";


        if (siguiente) {

            siguienteElemento.textContent =
                `Próxima: ${siguiente[0]} · ${siguiente[1]}`;

            hora.textContent =
                siguiente[1];

        } else {

            siguienteElemento.textContent =
                "No hay más clases hoy";

            hora.textContent =
                "--";

        }

    }

}


// ======================================================
// TAREAS
// ======================================================

function renderizarTareas() {

    const inicio =
        document.getElementById(
            "tareas"
        );

    const panel =
        document.getElementById(
            "tareasCompletas"
        );


    const pendientes =
        tareas.filter(
            tarea =>
                !tarea.completada
        );


    const completadas =
        tareas.filter(
            tarea =>
                tarea.completada
        );


    const contador =
        document.getElementById(
            "contadorTareas"
        );


    if (contador) {

        contador.textContent =
            pendientes.length;

    }


    if (inicio) {

        inicio.innerHTML =
            "";


        if (
            pendientes.length === 0
        ) {

            inicio.innerHTML = `
                <div class="clase">
                    <div class="clase-nombre">
                        No tienes tareas pendientes
                    </div>
                </div>
            `;

        } else {

            pendientes
                .slice()
                .sort(
                    ordenarTareas
                )
                .slice(0, 5)
                .forEach(
                    tarea => {

                        inicio.innerHTML +=
                            crearHTMLTarea(
                                tarea
                            );

                    }
                );

        }

    }


    if (panel) {

        panel.innerHTML =
            "";


        const lista =
            filtroActual === "pendientes"
                ? pendientes
                : completadas;


        if (
            lista.length === 0
        ) {

            panel.innerHTML = `
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

        } else {

            lista
                .slice()
                .sort(
                    ordenarTareas
                )
                .forEach(
                    tarea => {

                        panel.innerHTML +=
                            crearHTMLTarea(
                                tarea
                            );

                    }
                );

        }

    }

}


// ======================================================
// ORDENAR
// ======================================================

function ordenarTareas(a, b) {

    if (!a.fecha && !b.fecha) return 0;

    if (!a.fecha) return 1;

    if (!b.fecha) return -1;

    return (
        new Date(a.fecha)
        -
        new Date(b.fecha)
    );

}


// ======================================================
// HTML TAREA
// ======================================================

function crearHTMLTarea(tarea) {

    let fechaTexto =
        "Sin fecha";


    if (tarea.fecha) {

        const fecha =
            new Date(
                tarea.fecha
            );


        fechaTexto =
            fecha.toLocaleDateString(
                "es-MX",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                }
            );


        fechaTexto +=
            " · "
            +
            fecha.toLocaleTimeString(
                "es-MX",
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );

    }


    return `

        <div class="tarea ${
            tarea.completada
                ? "tarea-completada"
                : ""
        }">

            <div class="tarea-top">

                <div>

                    <div class="tarea-materia">
                        ${escaparHTML(tarea.materia)}
                    </div>

                    <div class="tarea-nombre">
                        ${escaparHTML(tarea.nombre)}
                    </div>

                    <div class="tarea-fecha">
                        ${fechaTexto}
                    </div>

                </div>

                <button
                    class="completar"
                    onclick="cambiarEstadoTarea(${tarea.id})"
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
// COMPLETAR TAREA
// ======================================================

function cambiarEstadoTarea(id) {

    const tarea =
        tareas.find(
            t => t.id === id
        );


    if (!tarea) return;


    tarea.completada =
        !tarea.completada;


    guardarDatos();

    renderizarTareas();


    if (tarea.completada) {

        responderEV(
            `Listo, David. Marqué ${tarea.nombre} como completada.`
        );

    } else {

        responderEV(
            `Volví a poner ${tarea.nombre} como pendiente.`
        );

    }

}


// ======================================================
// INTERPRETAR FECHA
// ======================================================

function interpretarFecha(texto) {

    if (
        !texto ||
        !texto.trim()
    ) {

        return null;

    }


    const normalizado =
        normalizarTexto(
            texto
        );


    const ahora =
        new Date();


    // MAÑANA

    if (
        normalizado.includes(
            "manana"
        )
    ) {

        const fecha =
            new Date(ahora);

        fecha.setDate(
            fecha.getDate() + 1
        );


        establecerHoraDesdeTexto(
            fecha,
            normalizado
        );


        return fecha;

    }


    // HOY

    if (
        normalizado.includes(
            "hoy"
        )
    ) {

        const fecha =
            new Date(ahora);


        establecerHoraDesdeTexto(
            fecha,
            normalizado
        );


        return fecha;

    }


    // DÍAS

    const dias = {

        domingo: 0,
        lunes: 1,
        martes: 2,
        miercoles: 3,
        jueves: 4,
        viernes: 5,
        sabado: 6

    };


    for (
        const dia in dias
    ) {

        if (
            normalizado.includes(
                dia
            )
        ) {

            const objetivo =
                dias[dia];


            const actual =
                ahora.getDay();


            let diferencia =
                objetivo - actual;


            if (
                diferencia <= 0
            ) {

                diferencia += 7;

            }


            const fecha =
                new Date(ahora);


            fecha.setDate(
                fecha.getDate()
                +
                diferencia
            );


            establecerHoraDesdeTexto(
                fecha,
                normalizado
            );


            return fecha;

        }

    }


    return null;

}


// ======================================================
// HORA
// ======================================================

function establecerHoraDesdeTexto(
    fecha,
    texto
) {

    const coincidencia =
        texto.match(
            /\b([01]?\d|2[0-3])(?::([0-5]\d))?\s*(am|pm)?\b/i
        );


    if (!coincidencia) {

        return;

    }


    let hora =
        Number(
            coincidencia[1]
        );


    const minutos =
        coincidencia[2]
            ? Number(
                coincidencia[2]
            )
            : 0;


    const periodo =
        coincidencia[3]
            ? coincidencia[3].toLowerCase()
            : null;


    if (
        periodo === "am"
    ) {

        if (
            hora === 12
        ) {

            hora = 0;

        }

    } else if (
        periodo === "pm"
    ) {

        if (
            hora !== 12
        ) {

            hora += 12;

        }

    } else {

        // Por defecto PM

        if (
            hora >= 1 &&
            hora <= 11
        ) {

            hora += 12;

        }

    }


    fecha.setHours(
        hora,
        minutos,
        0,
        0
    );

}


// ======================================================
// NORMALIZAR
// ======================================================

function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

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
// E.V. HABLA
// ======================================================

let vozActual = null;


function hablar(texto) {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    window.speechSynthesis.cancel();


    const mensaje =
        new SpeechSynthesisUtterance(
            texto
        );


    mensaje.lang =
        "es-MX";


    mensaje.rate =
        1.0;


    mensaje.pitch =
        1.05;


    mensaje.volume =
        1.0;


    const voces =
        window.speechSynthesis
            .getVoices();


    const vozEspañol =
        voces.find(
            voz =>
                voz.lang
                    .toLowerCase()
                    .startsWith("es")
        );


    if (vozEspañol) {

        mensaje.voice =
            vozEspañol;

    }


    vozActual =
        mensaje;


    window.speechSynthesis.speak(
        mensaje
    );

}


// ======================================================
// RESPONDER
// ======================================================

function responderEV(
    mensaje
) {

    const elemento =
        document.getElementById(
            "respuestaEV"
        );


    if (elemento) {

        elemento.textContent =
            mensaje;

    }


    hablar(
        mensaje
    );

}


// ======================================================
// DETENER VOZ
// ======================================================

function detenerVoz() {

    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();

    }

}


// ======================================================
// ESCUCHAR
// ======================================================

function escuchar() {

    const Recognition =
        window.SpeechRecognition
        ||
        window.webkitSpeechRecognition;


    if (!Recognition) {

        responderEV(
            "Tu navegador no permite reconocimiento de voz."
        );

        return;

    }


    const reconocimiento =
        new Recognition();


    reconocimiento.lang =
        "es-MX";


    reconocimiento.continuous =
        false;


    reconocimiento.interimResults =
        false;


    reconocimiento.maxAlternatives =
        1;


    responderTexto(
        "Te escucho..."
    );


    reconocimiento.start();


    reconocimiento.onresult =
        function(evento) {

            const texto =
                evento
                    .results[0][0]
                    .transcript;


            responderTexto(
                "Entendí: " + texto
            );


            procesarComando(
                texto
            );

        };


    reconocimiento.onerror =
        function(evento) {

            console.log(
                evento.error
            );


            responderEV(
                "No pude escucharte. Inténtalo otra vez."
            );

        };


    reconocimiento.onend =
        function() {

            const boton =
                document.getElementById(
                    "botonEscuchar"
                );


            if (boton) {

                boton.classList.remove(
                    "escuchando"
                );

            }

        };


    const boton =
        document.getElementById(
            "botonEscuchar"
        );


    if (boton) {

        boton.classList.add(
            "escuchando"
        );

    }

}


// ======================================================
// TEXTO SIN VOZ
// ======================================================

function responderTexto(
    mensaje
) {

    const elemento =
        document.getElementById(
            "respuestaEV"
        );


    if (elemento) {

        elemento.textContent =
            mensaje;

    }

}


// ======================================================
// PROCESAR ENTRADA
// ======================================================

function procesarEntrada() {

    const entrada =
        document.getElementById(
            "entradaTexto"
        );


    if (!entrada) return;


    const texto =
        entrada.value.trim();


    if (!texto) return;


    entrada.value =
        "";


    procesarComando(
        texto
    );

}


// ======================================================
// COMANDOS
// ======================================================

function procesarComando(
    texto
) {

    const normalizado =
        normalizarTexto(
            texto
        );


    // TAREAS

    if (
        normalizado.includes("tarea")
        ||
        normalizado.includes("entregar")
        ||
        normalizado.includes("subir")
    ) {

        agregarTareaDesdeTexto(
            texto
        );

        return;

    }


    // TAREAS PENDIENTES

    if (
        normalizado.includes(
            "que tengo"
        )
        &&
        normalizado.includes(
            "tarea"
        )
    ) {

        hablarDeTareas();

        return;

    }


    // HORARIO

    if (
        normalizado.includes(
            "horario de hoy"
        )
        ||
        normalizado.includes(
            "que tengo hoy"
        )
    ) {

        hablarHorarioHoy();

        return;

    }


    if (
        normalizado.includes(
            "que tengo manana"
        )
    ) {

        hablarHorarioManana();

        return;

    }


    responderEV(
        "No entendí esa orden. Puedes preguntarme por tus tareas o tu horario."
    );

}


// ======================================================
// AGREGAR TAREA DESDE VOZ/TEXTO
// ======================================================

function agregarTareaDesdeTexto(
    texto
) {

    const materia =
        detectarMateria(
            texto
        );


    if (!materia) {

        responderEV(
            "No pude identificar la materia."
        );

        return;

    }


    let nombre =
        detectarNombreTarea(
            texto
        );


    if (!nombre) {

        responderEV(
            "Entendí la materia, pero no qué tienes que entregar."
        );

        return;

    }


    const fecha =
        interpretarFecha(
            texto
        );


    tareas.push({

        id:
            siguienteID++,

        materia:
            materia,

        nombre:
            nombre,

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

    });


    guardarDatos();

    renderizarTareas();


    if (fecha) {

        responderEV(
            `Listo, David. Guardé ${nombre} de ${materia}. Se entrega ${formatearFechaCompleta(fecha)}.`
        );

    } else {

        responderEV(
            `Listo, David. Guardé ${nombre} de ${materia}, pero no tiene fecha de entrega.`
        );

    }

}


// ======================================================
// DETECTAR MATERIA
// ======================================================

function detectarMateria(
    texto
) {

    const materias = [

        ["matematicas", "Matemáticas"],
        ["quimica", "Química"],
        ["fisica", "Física"],
        ["ingles", "Inglés"],
        ["bioetica", "Bioética"],
        ["artes", "Artes"],
        ["autotronica", "Autotrónica"],
        ["rep motores gasolina", "Rep. Motores gasolina"],
        ["rep. motores gasolina", "Rep. Motores gasolina"],
        ["rep carroceria", "Rep. Carroceria"],
        ["rep. carroceria", "Rep. Carroceria"]

    ];


    const normalizado =
        normalizarTexto(
            texto
        );


    for (
        const [busqueda, nombre]
        of materias
    ) {

        if (
            normalizado.includes(
                busqueda
            )
        ) {

            return nombre;

        }

    }


    return null;

}


// ======================================================
// NOMBRE DE TAREA
// ======================================================

function detectarNombreTarea(
    texto
) {

    let resultado =
        texto;


    resultado =
        resultado.replace(
            /agrega(?:r)?\s+(una\s+)?tarea/gi,
            ""
        );


    resultado =
        resultado.replace(
            /tengo\s+(que)?/gi,
            ""
        );


    resultado =
        resultado.replace(
            /de\s+(matemáticas|matematicas|química|quimica|física|fisica|inglés|ingles|bioética|bioetica|artes|autotrónica|autotronica)/gi,
            ""
        );


    resultado =
        resultado.replace(
            /\b(mañana|manana|hoy|lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado)\b/gi,
            ""
        );


    resultado =
        resultado.replace(
            /\ba\s+(las?|la)\s+\d{1,2}(?::\d{2})?\s*(am|pm)?/gi,
            ""
        );


    resultado =
        resultado.replace(
            /\bpara\b/gi,
            ""
        );


    resultado =
        resultado.replace(
            /\b(subir|entregar)\b/gi,
            ""
        );


    resultado =
        resultado
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    return resultado.length >= 2
        ? resultado
        : null;

}


// ======================================================
// HABLAR DE TAREAS
// ======================================================

function hablarDeTareas() {

    const pendientes =
        tareas.filter(
            t =>
                !t.completada
        );


    if (
        pendientes.length === 0
    ) {

        responderEV(
            "No tienes tareas pendientes, David."
        );

        return;

    }


    const tarea =
        pendientes
            .slice()
            .sort(
                ordenarTareas
            )[0];


    let respuesta =
        `Tienes ${pendientes.length} tarea${pendientes.length === 1 ? "" : "s"} pendiente${pendientes.length === 1 ? "" : "s"}. `;


    respuesta +=
        `La más próxima es ${tarea.nombre} de ${tarea.materia}`;


    if (tarea.fecha) {

        respuesta +=
            `, para ${formatearFechaCompleta(new Date(tarea.fecha))}`;

    }


    responderEV(
        respuesta
    );

}


// ======================================================
// HORARIO HOY
// ======================================================

function hablarHorarioHoy() {

    const lista =
        obtenerHorarioHoy();


    if (
        lista.length === 0
    ) {

        responderEV(
            "Hoy no tienes clases."
        );

        return;

    }


    responderEV(
        `Hoy tienes ${lista.length} clases. Tu primera clase es ${lista[0][0]} a la ${lista[0][1]}.`
    );

}


// ======================================================
// HORARIO MAÑANA
// ======================================================

function hablarHorarioManana() {

    const ahora =
        new Date();


    const dia =
        (
            ahora.getDay()
            +
            1
        ) % 7;


    const nombre =
        nombresDias[dia];


    const lista =
        horario[nombre] || [];


    if (
        lista.length === 0
    ) {

        responderEV(
            "Mañana no tienes clases."
        );

        return;

    }


    responderEV(
        `Mañana tienes ${lista.length} clases. Tu primera clase es ${lista[0][0]} a la ${lista[0][1]}.`
    );

}


// ======================================================
// FECHA FORMATEADA
// ======================================================

function formatearFechaCompleta(
    fecha
) {

    return fecha.toLocaleString(
        "es-MX",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


// ======================================================
// RECORDATORIOS
// ======================================================

function revisarRecordatorios() {

    const ahora =
        new Date();


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


            if (
                diferencia < 0
                &&
                !tarea.recordatorioVencida
            ) {

                tarea.recordatorioVencida =
                    true;


                responderEV(
                    `La tarea ${tarea.nombre} ya venció.`
                );


                notificar(
                    "Tarea vencida",
                    `${tarea.nombre} de ${tarea.materia} ya venció.`
                );


                guardarDatos();

                return;

            }


            if (
                minutos > 0
                &&
                minutos <= 15
                &&
                !tarea.recordatorio15
            ) {

                tarea.recordatorio15 =
                    true;


                responderEV(
                    `David, faltan menos de 15 minutos para entregar ${tarea.nombre}.`
                );


                notificar(
                    "Entrega próxima",
                    `${tarea.nombre} vence en menos de 15 minutos.`
                );


                guardarDatos();

            }

        }
    );

}


// ======================================================
// NOTIFICACIONES
// ======================================================

function solicitarNotificaciones() {

    if (
        "Notification" in window
        &&
        Notification.permission === "default"
    ) {

        Notification.requestPermission();

    }

}


function notificar(
    titulo,
    mensaje
) {

    if (
        "Notification" in window
        &&
        Notification.permission === "granted"
    ) {

        new Notification(
            titulo,
            {
                body: mensaje
            }
        );

    }

}


// ======================================================
// INICIAR
// ======================================================

function iniciarEV() {

    actualizarFecha();

    mostrarHorarioHoy();

    actualizarClase();

    renderizarTareas();

    solicitarNotificaciones();

    revisarRecordatorios();


    setInterval(
        () => {

            actualizarFecha();

            actualizarClase();

            revisarRecordatorios();

        },
        10000
    );

}


// ======================================================
// ENTER
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