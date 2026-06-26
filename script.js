const canaleTwitch = "saichozzo";
let punteggiUtenti = {};
let listaParole = [];

let parolaSegreta = ""; 
let lettereRivelate = [];
let timerSuggerimento = null;
let giocoAttivo = false;

function aggiornaGrafica() {
    const elemento = document.getElementById("word-display");
    if (elemento) {
        elemento.innerText = lettereRivelate.join(" ");
    }
}

function aggiornaClassifica() {
    const listaHTML = document.getElementById("leaderboard-list");
    if (!listaHTML) return;

    let classificaOrdinata = Object.entries(punteggiUtenti)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    let nuovoContenuto = "";
    const classiPodio = ["podium-1", "podium-2", "podium-3"];

    for (let i = 0; i < 3; i++) {
        if (classificaOrdinata[i]) {
            let nome = classificaOrdinata[i][0];
            let punti = classificaOrdinata[i][1];
            nuovoContenuto += `<li class="leaderboard-item"><span class="${classiPodio[i]}">${i+1}. ${nome}</span> <span>${punti} pt</span></li>`;
        } else {
            nuovoContenuto += `<li class="leaderboard-item"><span class="${classiPodio[i]}">${i+1}. ---</span> <span>0 pt</span></li>`;
        }
    }
    listaHTML.innerHTML = nuovoContenuto;
}

function rivelaLettera() {
    if (!giocoAttivo) return;
    
    let indiciNascosti = [];
    for (let i = 0; i < lettereRivelate.length; i++) {
        if (lettereRivelate[i] === "_") {
            indiciNascosti.push(i);
        }
    }

    if (indiciNascosti.length > 1) {
        let indiceCasuale = Math.floor(Math.random() * indiciNascosti.length);
        let posizioneVera = indiciNascosti[indiceCasuale];
        
        lettereRivelate[posizioneVera] = parolaSegreta[posizioneVera];
        aggiornaGrafica();
    } else {
        clearInterval(timerSuggerimento);
    }
}

function avviaGioco() {
    if (listaParole.length === 0) return;
    
    giocoAttivo = true;
    const indiceCasuale = Math.floor(Math.random() * listaParole.length);
    parolaSegreta = listaParole[indiceCasuale].toUpperCase();
    
    lettereRivelate = Array(parolaSegreta.length).fill("_");
    aggiornaGrafica();

    if (timerSuggerimento) clearInterval(timerSuggerimento);
    timerSuggerimento = setInterval(rivelaLettera, 45000); 
}

// Carica le parole dal file words.json
async function caricaParole() {
    try {
        const response = await fetch('words.json');
        listaParole = await response.json();
        avviaGioco();
    } catch (error) {
        console.error("Errore nel caricamento di words.json, uso lista di riserva", error);
        listaParole = ["STREAMER", "CHAT", "BLUR", "COMPUTER", "TASTIERA"];
        avviaGioco();
    }
}

const client = new tmi.Client({
    channels: [canaleTwitch]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    if (!giocoAttivo) return; 
    const tentativoUtente = message.trim().toUpperCase();

    if (tentativoUtente === parolaSegreta) {
        giocoAttivo = false;
        clearInterval(timerSuggerimento);

        const nomeVincitore = tags['display-name'] || tags['username'];

        if (punteggiUtenti[nomeVincitore]) {
            punteggiUtenti[nomeVincitore] += 1;
        } else {
            punteggiUtenti[nomeVincitore] = 1;
        }

        aggiornaClassifica();

        const elemento = document.getElementById("word-display");
        elemento.innerHTML = `<span style="color: #ffffff; font-size: 26px; letter-spacing: 0px;">INDOVINATA DA<br><span style="color: #00ff7f;">${nomeVincitore.toUpperCase()}</span></span>`;

        setTimeout(avviaGioco, 5000);
    }
});

window.onload = function() {
    caricaParole();
    aggiornaClassifica();
};
