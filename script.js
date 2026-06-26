let listaParole = [];
let parolaSegreta = ""; 
let lettereRivelate = [];
let timerSuggerimento = null;

// 1. Carica le parole dal tuo file words.json
async function caricaParole() {
    try {
        const risp = await fetch('words.json');
        if (!risp.ok) throw new Error("File JSON non trovato");
        listaParole = await risp.json();
        avviaNuovaPartita();
    } catch (errore) {
        console.error("Errore nel caricamento del JSON, uso parole di riserva:", errore);
        // Parole di riserva se il fetch fallisce in locale
        listaParole = ["orcozzio", "streamer", "cringe", "maranza", "javascript", "grattacielo"];
        avviaNuovaPartita();
    }
}

// 2. Mostra i trattini o le lettere rivelate nell'HTML
function aggiornaGraficaSito() {
    const elementoHTML = document.getElementById("word-display");
    if (elementoHTML) {
        // Unisce i trattini con uno spazio per renderli leggibili (es. _ _ _ _)
        elementoHTML.innerText = lettereRivelate.join(" ");
    }
}

// 3. Rileva una lettera a caso ogni 20 secondi
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
        let indiceCasuale = indiciNascosti[Math.floor(Math.random() * indiciNascosti.length)];
        
        // Rivela la lettera reale trasformandola in MAIUSCOLO
        lettereRivelate[indiceCasuale] = parolaSegreta[indiceCasuale].toUpperCase();
        
        aggiornaGraficaSito();
        console.log("Suggerimento: rivelata una lettera!");
    } else {
        clearInterval(timerSuggerimento);
        console.log("Timer fermato: rimane solo una lettera nascosta!");
    }
}

// 4. Avvia una nuova partita azzerando il timer
function avviaNuovaPartita() {
    if (listaParole.length === 0) return;

    // Scegli una parola a caso
    const indiceCasuale = Math.floor(Math.random() * listaParole.length);
    parolaSegreta = listaParole[indiceCasuale].toUpperCase();

    // Riempi l'array di trattini
    lettereRivelate = Array(parolaSegreta.length).fill("_");

    // Aggiorna lo schermo subito
    aggiornaGraficaSito();

    // Reset del timer precedente e avvio del nuovo loop (20 secondi = 20000ms)
    if (timerSuggerimento) clearInterval(timerSuggerimento);
    timerSuggerimento = setInterval(rivelaLetteraCasuale, 20000);
    
    console.log("Nuova parola avviata: " + parolaSegreta);
}

// Fai partire il tutto al caricamento della pagina
window.onload = caricaParole;
