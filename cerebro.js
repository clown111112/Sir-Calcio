// ============================ LÉXICO ============================
// Cada palabra tiene un puntaje: positivo si es amable, negativo si es grosera

const LEXICO = {
  // positivas
  gracias: 1, genial: 2, increible: 3, fabuloso: 3, magnifico: 4, estupendo: 3, lindo: 2, bello: 2, hermoso: 3, poderoso: 3,
  valiente: 2, fuerte: 3, inteligente: 2, admiro: 3, adoro: 2, amigo: 3, quiero: 1, capaz: 2, unico: 4, maravilloso: 3, asombroso: 3,
  // positivas propias del esqueleto
  elegante: 2, eterno: 3, legendario: 4, noble: 3, respeto: 3, honor: 3, leal: 3, sabio: 3, caballero: 2, valioso: 3,
  // negativas
  feo: -3, tonto: -3, idiota: -4, odio: -4, cobarde: -3, basura: -4, bobo: -3, inutil: -5, estupido: -5, malo: -2,
  imbecil: -3, aburrido: -2, absurdo: -2, cruel: -2, incapaz: -4, maldito: -3,
  // negativas propias del esqueleto
  podrido: -4, flaco: -2, cadaver: -3, quebradizo: -3, oxidado: -3, polvoriento: -3, huesudo: -2, debil: -3
};


// Deja el texto limpio para poder compararlo con el léxico
function normalizar(texto) {
  return texto
    .toLowerCase()                                      // todo a minúscula
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")   // quita tildes
    .replace(/[^a-zñ\s]/g, " ")                         // quita signos
    .trim();
}


// ============================ NEGADORES ============================

const NEGADORES = ["no", "nunca", "jamas", "tampoco"];


// Recibe un texto y devuelve un número: positivo si fue amable, negativo si fue grosero
function analizarSentimiento(texto) {
  const palabras = normalizar(texto).split(/\s+/);   // separa en palabras
  let puntaje = 0;

  palabras.forEach((palabra, i) => {
    let valor = LEXICO[palabra] || 0;                // puntaje de la palabra (0 si no existe)

    // "no eres feo": la negación invierte el valor
    if (valor !== 0 && (NEGADORES.includes(palabras[i - 1]) || NEGADORES.includes(palabras[i - 2]))) {
      valor = -valor;
    }
    puntaje += valor;
  });

  if (texto.includes("!") && puntaje < 0) puntaje -= 1;   // gritar empeora el insulto
  return puntaje;
}


// ============================ INTENCIONES ============================
// Cada intención tiene palabras clave. Gana la primera que aparezca en el mensaje

const INTENCIONES = [
  { nombre: "saludo",       claves: ["hola", "buenas", "saludos", "hey"] },
  { nombre: "llave",        claves: ["llave", "puerta", "abrir", "tesoro", "cripta"] },
  { nombre: "nombre",       claves: ["nombre", "llamas", "quien"] },
  { nombre: "chiste",       claves: ["chiste", "gracioso", "risa", "broma"] },
  { nombre: "comida",       claves: ["comida", "hambre", "comer", "leche"] },
  { nombre: "baile",        claves: ["baile", "bailar", "danza", "musica", "fiesta"] },
  { nombre: "huesos",       claves: ["hueso", "huesos", "esqueleto", "costillas", "calavera"] },
  { nombre: "despedida",    claves: ["adios", "chao", "bye", "hasta"] }
];


// Recibe un texto y devuelve el nombre de la intención que detecta
function detectarIntencion(texto) {
  const palabras = normalizar(texto).split(/\s+/);
  for (const intencion of INTENCIONES) {
    if (intencion.claves.some(c => palabras.includes(c))) return intencion.nombre;
  }
  return "desconocida";          // si no entendió nada
}


// ============================ RESPUESTAS ============================
// Para cada intención hay una respuesta de buen humor (bien) y otra de mal humor (mal)

const RESPUESTAS = {
  saludo: {
    bien: "¡Saludos, viajero! Soy Sir Calcio, guardián de esta cripta. Disculpa el crujido, son mis rodillas.",
    mal:  "¿Quién interrumpe mi guardia? Ten cuidado, que mis huesos no se rompen tan fácil como los tuyos."
  },
  llave: {
    bien: "¿Vienes por la llave de la cripta? Tienes buenos modales, pero aún debo ver de qué estás hecho.",
    mal:  "La llave es mía desde hace trescientos años. Antes me desarmo que dártela."
  },
  nombre: {
    bien: "Sir Calcio, caballero del reino, ahora esqueleto de tiempo completo. ¿Y tú, noble viajero?",
    mal:  "Mi nombre es 'el último crujido que escucharás'."
  },
  chiste: {
    bien: "¿Sabes por qué los esqueletos no pelean entre ellos? Porque no tienen agallas. ¡Ja, ja, ja! 💀",
    mal:  "¿Un chiste? Aquí lo único gracioso eres tú, con tanta carne encima."
  },
  comida: {
    bien: "Extraño un buen vaso de leche, para mis huesos, ya sabes. Lástima que se me cuela por las costillas.",
    mal:  "¿Comida? No tengo estómago para tus preguntas. Ni estómago ni paciencia."
  },
  baile: {
    bien: "¿Bailar? ¡Hacía siglos que nadie me lo proponía! Cuidado con mis rodillas, que hacen mucho ruido.",
    mal:  "¿Bailar contigo? Ni muerto... bueno, ya lo estoy, pero igual no."
  },
  huesos: {
    bien: "Me quedan doscientos seis huesos y los cuido como un tesoro. Me gusta que lo notes, tienes buen ojo.",
    mal:  "¿Te burlas de mis huesos? Ven acá y te saco una costilla para que veas lo que se siente."
  },
  despedida: {
    bien: "Vuelve pronto, amigo. Pocos visitantes hacen que mis huesos se sientan menos solos.",
    mal:  "¡Largo de mi cripta! Y no vuelvas, que aquí lo único que sobra es eternidad."
  },
  desconocida: {
    bien: "Llevo siglos sin oídos... ¿podrías decirlo de otra forma? Me caes bien.",
    mal:  "No entiendo nada de lo que dices. Exprésate mejor o regresa al polvo."
  }
};


// ============================ IA EN LA NUBE ============================

// Le pide la respuesta al SERVIDOR (nunca a NVIDIA directo, porque la clave es secreta).
// Si algo falla devuelve null y el juego usa el diccionario como plan B
async function consultarIA(texto, historial) {
  try {
    const respuesta = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje: texto, historial }),
      signal: AbortSignal.timeout(20000)
    });
    if (!respuesta.ok) return null;
    return await respuesta.json();     // { sentimiento: -10..10, respuesta: "..." }
  } catch (error) {
    return null;
  }
}