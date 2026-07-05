import { databaseEstrazioni } from './supabase-config.js';

export const mesiIta = {
    'gen': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mag': 4, 'giu': 5,
    'lug': 6, 'ago': 7, 'set': 8, 'ott': 9, 'nov': 10, 'dic': 11
};
export const mesiItaInversi = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];

export function mostraSchermata(idSchermata) {
    document.getElementById('screen-login').classList.add('hidden');
    document.getElementById('screen-main').classList.add('hidden');
    document.getElementById('screen-inserimento').classList.add('hidden');
    document.getElementById('screen-filtro-date').classList.add('hidden');
    document.getElementById('screen-visualizza').classList.add('hidden');
    
    document.getElementById(idSchermata).classList.remove('hidden');
}

export function formattaDataPerUomo(stringaDataISO) {
    const parti = stringaDataISO.split('-');
    const giorno = parti[2];
    const meseNum = parseInt(parti[1]) - 1;
    const meseTesto = mesiItaInversi[meseNum];
    const anno = parti[0].substring(2);
    return `${giorno}-${meseTesto}-${anno}`;
}

export function aggiornaDashboard() {
    const lista = databaseEstrazioni.data;
    if (lista.length === 0) {
        document.getElementById('lbl-ultima-data').innerText = "Nessuna (Archivio vuoto)";
        document.getElementById('lbl-totale-record').innerText = "0";
    } else {
        const ultima = lista[lista.length - 1];
        document.getElementById('lbl-ultima-data').innerText = formattaDataPerUomo(ultima.data);
        document.getElementById('lbl-totale-record').innerText = lista.length;
    }
}

export function caricaEVisualizzaStorico(dataInizioISO, dataFineISO) {
    const corpo = document.getElementById('corpo-tabella');
    const titolo = document.getElementById('titolo-visualizzazione');
    corpo.innerHTML = "";

    let datiDaMostrare = [...databaseEstrazioni.data];

    if (dataInizioISO && dataFineISO) {
        datiDaMostrare = datiDaMostrare.filter(est => est.data >= dataInizioISO && est.data <= dataFineISO);
        titolo.innerText = "Storico Filtrato Periodo";
    } else {
        titolo.innerText = "Archivio Estrazioni Recenti Caricate";
    }

    datiDaMostrare.sort((a, b) => new Date(b.data) - new Date(a.data));

    datiDaMostrare.forEach(est => {
        const tr = document.createElement('tr');
        
        const tdData = document.createElement('td');
        tdData.innerText = formattaDataPerUomo(est.data);
        
        const tdSestina = document.createElement('td');
        tdSestina.className = "td-sestina";
        tdSestina.innerText = `${est.n1} - ${est.n2} - ${est.n3} - ${est.n4} - ${est.n5} - ${est.n6}`;
        
        const tdJ = document.createElement('td');
        tdJ.className = "highlight-j";
        tdJ.innerText = est.jolly;
        
        const tdSS = document.createElement('td');
        tdSS.className = "highlight-ss";
        tdSS.innerText = est.superstar;
        
        tr.appendChild(tdData);
        tr.appendChild(tdSestina);
        tr.appendChild(tdJ);
        tr.appendChild(tdSS);
        corpo.appendChild(tr);
    });

    mostraSchermata('screen-visualizza');
}

export function mostraErroreInserimento(msg) {
    const errDiv = document.getElementById('ins-error');
    errDiv.innerText = msg; 
    errDiv.classList.remove('hidden');
}