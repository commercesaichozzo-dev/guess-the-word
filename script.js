// Esempio di variabili (adatta le tue se hanno nomi diversi)
let parolaSegreta = "JAVASCRIPT"; 
let lettereRivelate = Array(parolaSegreta.length).fill("_"); // [ '_', '_', '_', ... ]
let timerSuggerimento = null;

// Funzione che mostra la grafica a schermo (quella con i trattini che si vede in image_e3ab89.png)
function aggiornaGraficaSito() {
    // Sostituisci 'contenitore-parola' con l'ID del tuo elemento HTML reale
    document.getElementById("contenitore-parola").innerText = lettereRivelate.join(" ");
}

// Funzione principale che rivela una lettera casuale ancora nascosta
function rivelaLetteraCasuale() {
    let indiciNascosti = [];

    // Trova le posizioni di tutte le lettere che sono ancora dei trattini "_"
    for (let i = 0; i < lettereRivelate.length; i++) {
        if (lettereRivelate[i] === "_") {
            indiciNascosti.push(i);
        }
    }

    // Se rimangono lettere nascoste (lasciamo l'ultima coperta per non regalare la vittoria!)
    if (indiciNascosti.length > 1) {
        // Scegli un indice a caso tra quelli nascosti
        let indiceCasuale = indiciNascosti[Math.floor(Math.random() * indiciNascosti.length)];
        
        // Riveliamo la lettera corretta in quella posizione
        lettereRivelate[indiceCasuale] = parolaSegreta[indiceCasuale];
        
        // Aggiorna la grafica del gioco su OBS
        aggiornaGraficaSito();
        console.log("Suggerimento automatico: rivelata una lettera!");
    } else {
        // Se la parola è quasi tutta rivelata, ferma il timer
        clearInterval(timerSuggerimento);
    }
}

// Funzione da attivare quando inizia una nuova partita/parola
function avviaNuovaPartita() {
    // ... resetta la parola, i trattini, ecc. ...
    
    // Cancella eventuali timer precedenti per sicurezza
    if (timerSuggerimento) clearInterval(timerSuggerimento);

    // Fai partire il loop: esegue 'rivelaLetteraCasuale' ogni 20000 millisecondi (20 secondi)
    timerSuggerimento = setInterval(rivelaLetteraCasuale, 20000);
}

// Quando la parola viene indovinata dalla chat di Twitch, ricordati di resettare il timer!
function parolaIndovinata() {
    clearInterval(timerSuggerimento);
    alert("La chat ha indovinato!");
}
