let listaParole = [];
let parolaSegreta = ""; 
let lettereRivelate = [];
let timerSuggerimento = null;

// 1. Funzione per caricare le parole dal file words.json
async function caricaParole() {
    try {
        const risp = await fetch('words.json');
        listaParole = await risp.json();
        // Una volta caricate le parole, avvia la prima partita
        avviaNuovaPartita();
    } catch (errore) {
        console.error("Errore nel caricamento delle parole:", errore);
        // Fallback di sicurezza se il JSON non si carica
        listaParole = ["javascript", "streamer", "cringe", "maranza"];
        avviaNuovaPartita();
    }
}

// 2. Funzione per mostrare i trattini a schermo (es. _ _ _ _ _)
function aggiornaGraficaSito() {
    // Sostituisci 'contenitore-parola' con l'ID reale del tuo DIV nell'index.html
    const elementoHTML = document.getElementById("contenitore-parola");
    if (elementoHTML) {
        elementoHTML.innerText = lettereRivelate.join(" ");
    }
}

// 3. Funzione che rivela una lettera casuale ogni 20 secondi
function rivelaLetteraCasuale() {
    let indiciNascosti = [];

    // Trova la posizione di tutti i trattini ancora non indovinati
    for (let i = 0; i < lettereRivelate.length; i++) {
        if (lettereRivelate[i] === "_") {
            indiciNascosti.push(i);
        }
    }

    // Rivela una lettera solo se ne rimangono almeno 2 nascoste 
    // (lasciamo l'ultima coperta così la chat deve comunque indovinarla!)
    if (indiciNascosti.length > 1) {
        let indiceCasuale = indiciNascosti[Math.floor(Math.random() * indiciNascosti.length)];
        
        // Sostituiamo il trattino con la lettera reale (convertita in maiuscolo per estetica)
        lettereRivelate[indiceCasuale] = parolaSegreta[indiceCasuale].toUpperCase();
        
        aggiornaGraficaSito();
        console.log("Suggerimento automatico: rivelata una lettera!");
    } else {
        // Se la parola è praticamente scoperta, ferma il timer
        clearInterval(timerSuggerimento);
    }
}

// 4. Funzione per avviare una nuova partita
function avviaNuovaPartita() {
    if (listaParole.length === 0) return;

    // Sceglie una parola a caso dal mix di 100 parole
    const indiceCasuale = Math.floor(Math.random() * listaParole.length);
    parolaSegreta = listaParole[indiceCasuale].toUpperCase();

    // Crea i trattini vuoti in base alla lunghezza della parola
    lettereRivelate = Array(parolaSegreta.length).fill("_");

    // Mostra i trattini vuoti a schermo su OBS
    aggiornaGraficaSito();

    // Riavvia il timer da 20 secondi (20000 millisecondi)
    if (timerSuggerimento) clearInterval(timerSuggerimento);
    timerSuggerimento = setInterval(rivelaLetteraCasuale, 20000);
    
    console.log("Nuova partita avviata! Parola da indovinare: " + parolaSegreta);
}

// 5. Funzione da chiamare quando la chat indovina (collegata al tuo sistema Twitch)
function parolaIndovinataDallaChat() {
    clearInterval(timerSuggerimento);
    console.log("La chat ha indovinato!");
    // Qui puoi mettere la tua logica di vittoria (es. +1 punto, messaggi a schermo, ecc.)
    
    // Dopo 5 secondi di celebrazione, avvia automaticamente una nuova parola
    setTimeout(avviaNuovaPartita, 5000);
}

// Avvia il caricamento del gioco non appena la pagina si apre
window.onload = caricaParole;
