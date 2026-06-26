// Mettiamo le parole direttamente qui dentro per evitare blocchi del browser!
const listaParole = [
  "orcozzio", "sdrumata", "pazzurdo", "marza", "giammo", "blur", "scam", "clown", "goliardico", "chad", 
  "boomer", "zoomer", "bannato", "streamer", "subbato", "hype", "clip", "triggerato", "cringe", "flammare", 
  "gabbato", "blastato", "droppato", "ziarone", "paccato", "skippato", "snitch", "flexare", "shippare", "toxic", 
  "nerfare", "buffare", "clutch", "tryhard", "tiltato", "onesto", "sdrogo", "maranza", "collasso", "cialtrone", 
  "ruspante", "panettone", "computer", "javascript", "grattacielo", "barbagianni", "telefono", "github", "ornitorinco", "streaming", 
  "monitor", "astronave", "biscotto", "cappuccino", "divano", "elefante", "formaggio", "giraffa", "insalata", "lampione", 
  "matita", "nuvola", "ombrello", "pinguino", "quaderno", "righello", "scoiattolo", "tastiera", "universo", "valigia", 
  "zaino", "aeroporto", "bicicletta", "chitarra", "dinosauro", "elicottero", "fontana", "gelato", "idraulico", "lucertola", 
  "margherita", "negozio", "orologio", "pomodoro", "quadrifoglio", "rubinetto", "semaforo", "televisore", "unghia", "vulcano", 
  "zucchero", "altalena", "balena", "cioccolato", "delfino", "esploratore", "farfalla", "gondola", "ippopotamo", "lanterna",
  "pino", "gatto", "esplosione", "lumaca", "povero", "sbirro", "grandissimo", "hotel"
];

let parolaSegreta = ""; 
let lettereRivelate = [];
let timerSuggerimento = null;

// Mostra i trattini o le lettere nell'HTML
function aggiornaGraficaSito() {
    const elementoHTML = document.getElementById("word-display");
    if (elementoHTML) {
        elementoHTML.innerText = lettereRivelate.join(" ");
    }
}

// Rivela una lettera a caso ogni 20 secondi
function rivelaLetteraCasuale() {
    let indiciNascosti = [];

    // Trova le posizioni dei trattini rimasti
    for (let i = 0; i < lettereRivelate.length; i++) {
        if (lettereRivelate[i] === "_") {
            indiciNascosti.push(i);
        }
    }

    // Lascia sempre l'ultima lettera coperta per il gioco
    if (indiciNascosti.length > 1) {
        let indiceCasuale = Math.floor(Math.random() * indiciNascosti.length);
        let posizioneVera = indiciNascosti[indiceCasuale];
        
        // Rivela la lettera reale
        lettereRivelate[posizioneVera] = parolaSegreta[posizioneVera].toUpperCase();
        
        aggiornaGraficaSito();
        console.log("Suggerimento automatico inserito!");
    } else {
        clearInterval(timerSuggerimento);
    }
}

// Avvia una nuova partita azzerando il timer
function avviaNuovaPartita() {
    // Scegli una parola a caso
    const indiceCasuale = Math.floor(Math.random() * listaParole.length);
    parolaSegreta = listaParole[indiceCasuale].toUpperCase();

    // Riempi l'array di trattini
    lettereRivelate = Array(parolaSegreta.length).fill("_");

    // Aggiorna lo schermo subito
    aggiornaGraficaSito();

    // Reset del timer precedente e avvio del nuovo loop (20000ms = 20 secondi)
    if (timerSuggerimento) clearInterval(timerSuggerimento);
    timerSuggerimento = setInterval(rivelaLetteraCasuale, 20000);
}

// Fai partire il tutto appena la pagina si apre
window.onload = avviaNuovaPartita;
