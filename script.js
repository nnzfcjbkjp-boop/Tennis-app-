// =========================
// Instellingen
// =========================

let priveTarief =
    Number(localStorage.getItem("priveTarief")) || 63;

let groepTarief =
    Number(localStorage.getItem("groepTarief")) || 67;

let btwPercentage =
    Number(localStorage.getItem("btwPercentage")) || 21;

let lessen =
    JSON.parse(localStorage.getItem("lessen")) || [];

const seizoenTotaal = 16;

let alleLessenOpen = false;

let openDagen = {
    maandag: false,
    dinsdag: false,
    woensdag: false,
    donderdag: false,
    vrijdag: false,
    zaterdag: false,
    zondag: false
};

let openDatums = {};

let openSeizoensDagen = {
    maandag: false,
    dinsdag: false,
    woensdag: false,
    donderdag: false,
    vrijdag: false,
    zaterdag: false,
    zondag: false
};

let weekOffset = 0;

let bewerkIndex = null;

let openBewerkLes = null;

// =========================
// Opstarten
// =========================

window.onload = function () {
    
    
    toonDatum();

    document.getElementById("priveTarief").value =
        priveTarief;

    document.getElementById("groepTarief").value =
        groepTarief;

    document.getElementById("btwPercentage").value =
        btwPercentage;

    document.getElementById("lesDatum").value =
        vandaag();

    document.getElementById("lesTijd").value =
        huidigeTijd();

    updateTariefPreview();

    updateBlokType();
    
    updateDashboard();
};


// =========================
// Les toevoegen
// =========================

function voegLesToe(type) {

    const tarief =
    type === "prive"
        ? priveTarief
        : type === "groep"
        ? groepTarief
        : 0;

   lessen.push({

    datum:
        document.getElementById("lesDatum").value,

    tijdstip:
        document.getElementById("lesTijd").value,

    type: type,

    tarief: tarief

});

   opslaan();

updateDashboard();

if (type === "prive") {

    toonMelding(
        "✅ Privéles toegevoegd"
    );

} else if (type === "groep") {

    toonMelding(
        "✅ Groepsles toegevoegd"
    );

} else if (type === "weersomstandigheden") {

    toonMelding(
        "🌧️ Weer geregistreerd"
    );

} else if (type === "vakantie") {

    toonMelding(
        "🏖️ Vakantie geregistreerd"
    );

} else {

    toonMelding(
        "🤒 Leerling afwezig"
    );
}

}
// =========================
// Les verwijderen
// =========================

function verwijderLes(index) {

    const lessenVandaag =
        lessen.filter(
            les => les.datum === vandaag()
        );

    const les =
        lessenVandaag[index];

    const origineelIndex =
        lessen.indexOf(les);

    if (origineelIndex !== -1) {

        lessen.splice(
            origineelIndex,
            1
        );

        opslaan();

        updateDashboard();
    }
}

function toonMelding(tekst) {

    const melding =
        document.getElementById(
            "toastMelding"
        );

    melding.innerText =
        tekst;

    melding.classList.add(
        "show"
    );

    setTimeout(() => {

        melding.classList.remove(
            "show"
        );

    }, 1800);
}

function verwijderHistorischeLes(index) {

    const bevestiging = confirm(
        "Deze les verwijderen?"
    );

    if (!bevestiging) return;

    lessen.splice(index, 1);

    opslaan();

    updateDashboard();
}

function toggleAlleLessen() {

    alleLessenOpen =
        !alleLessenOpen;

    updateDashboard();
}

function toggleBewerken(index) {

    if (openBewerkLes === index) {

        openBewerkLes = null;

    } else {

        openBewerkLes = index;
    }

    updateDashboard();
}

function opslaanLes(index) {

    const nieuwType =
        document.getElementById(
            `edit-type-${index}`
        ).value;

    const nieuwTarief =
        Number(
            document.getElementById(
                `edit-tarief-${index}`
            ).value
        );

    const nieuwTijdstip =
        document.getElementById(
            `edit-tijd-${index}`
        ).value;

    lessen[index].datum =
        document.getElementById(
            `edit-datum-${index}`
        ).value;

    lessen[index].tijdstip =
        nieuwTijdstip || "Uitval";

    lessen[index].type =
        nieuwType;

    lessen[index].tarief =
        nieuwTarief;

    openBewerkLes = null;

    opslaan();

    updateDashboard();

    toonMelding(
        "✅ Les bijgewerkt"
    );
}

function updateEditTarief(index) {

    const type =
        document.getElementById(
            `edit-type-${index}`
        ).value;

    const tariefVeld =
        document.getElementById(
            `edit-tarief-${index}`
        );

    if (type === "prive") {

        tariefVeld.value =
            priveTarief;

    } else if (type === "groep") {

        tariefVeld.value =
            groepTarief;

    } else {

        tariefVeld.value =
            0;
    }
}


function toggleDag(dag) {

    openDagen[dag] =
        !openDagen[dag];

    updateDashboard();
}

function toggleMenu() {

    const menu =
        document.getElementById("fabMenu");

    const knop =
        document.getElementById("fab");

    menu.classList.toggle("open");

    document
        .querySelectorAll(".fab-label")
        .forEach(label =>
            label.classList.toggle("show")
        );

    knop.textContent =
        menu.classList.contains("open")
            ? "✕"
            : "+";

    if (!menu.classList.contains("open")) {

    document
        .getElementById("fabSubMenu")
        .classList.remove("open");

    }

}


function openSubMenu(type) {

    const popup = document.getElementById("fabSubMenu");
    const overlay = document.getElementById("overlay");

    // 1. LES TOEVOEGEN
    if (type === "les") {

        popup.innerHTML = `
            <div class="popup-title">🎾 Les toevoegen</div>

            <label>Datum</label>
            <input type="date" id="popupDatum" value="${vandaag()}">

            <label>Tijd</label>
            <input type="time" id="popupTijd" value="${huidigeTijd()}">

            <label>Type les</label>
            <select id="popupType" onchange="updatePopupTarief()">
    <option value="prive">🎾 Privéles</option>
    <option value="groep">👥 Groepsles</option>
    <option value="weersomstandigheden">🌧️ Weer</option>
    <option value="afwezig">🤒 Leerling afwezig</option>
    <option value="trainer_afwezig">🚫 Trainer afwezig</option>
</select>

            <div id="popupTarief" style="
                text-align:center;
                font-size:24px;
                font-weight:700;
                color:#A8F044;
                margin:16px 0;">
                ${euro(priveTarief)}
            </div>

            <button class="registreren-button"
                onclick="registreerPopupLes()">
                ➕ Les toevoegen
            </button>

            <button class="popup-close" onclick="closePopup()">
                Sluiten
            </button>
        `;
    }

    // 2. INSTELLINGEN
    else if (type === "instellingen") {

        popup.innerHTML = `
            <div class="popup-title">⚙️ Instellingen</div>

            <label>Privéles tarief (€)</label>
            <input type="number" id="popupPriveTarief"
                min="0" step="0.01" value="${priveTarief}">

            <label>Groepsles tarief (€)</label>
            <input type="number" id="popupGroepTarief"
                min="0" step="0.01" value="${groepTarief}">

            <label>BTW percentage (%)</label>
            <input type="number" id="popupBtw"
                min="0" step="0.1" value="${btwPercentage}">

            <button class="registreren-button"
                onclick="slaPopupInstellingenOp()">
                💾 Instellingen opslaan
            </button>

            <button class="popup-close" onclick="closePopup()">
                Sluiten
            </button>
        `;
    }

  
// 3. LESBLOK
else if (type === "blok") {

    popup.innerHTML = `
        <div class="popup-title">📝 Lesblok registreren</div>

        <div class="blok-form">

            <div class="blok-field">
                <label>Type</label>
                <select id="popupBlokType"
                    onchange="updatePopupBlokType()">
                    <option value="prive">🎾 Privéles</option>
                    <option value="groep">👥 Groepsles</option>
                    <option value="weersomstandigheden">🌧️ Weer</option>
                    <option value="vakantie">🏖️ Vakantie</option>
                    <option value="afwezig">🤒 Leerling afwezig</option>
                </select>
            </div>

            <div class="blok-datums">
                <div class="blok-field">
                    <label>Startdatum</label>
                    <input type="date" id="popupBlokStartDatum"
                        value="${vandaag()}">
                </div>

                <div class="blok-field">
                    <label>Einddatum</label>
                    <input type="date" id="popupBlokEindDatum"
                        value="${vandaag()}">
                </div>
            </div>

            <div id="popupTijdBlok" class="blok-tijden">

                <div class="blok-field">
                    <label>Starttijd</label>
                    <input type="time" id="popupBlokStart" value="09:00">
                </div>

                <div class="blok-field">
                    <label>Eindtijd</label>
                    <input type="time" id="popupBlokEinde" value="17:00">
                </div>

                <div class="blok-field">
                    <label>Interval (minuten)</label>
                    <input type="number" id="popupBlokInterval"
                        value="60" min="1">
                </div>

            </div>

            <div class="blok-actions">
                <button class="registreren-button"
                    onclick="registreerPopupBlok()">
                    ✅ Blok registreren
                </button>

                <button class="popup-close" onclick="closePopup()">
                    Sluiten
                </button>
            </div>

        </div>
    `;
}

overlay.classList.add("open");
popup.classList.add("open");

}

// Instellingen opslaan vanuit popup
function slaPopupInstellingenOp() {

    const prive = Number(
        document.getElementById("popupPriveTarief").value
    );

    const groep = Number(
        document.getElementById("popupGroepTarief").value
    );

    const btw = Number(
        document.getElementById("popupBtw").value
    );

    if (
        !Number.isFinite(prive) || prive < 0 ||
        !Number.isFinite(groep) || groep < 0 ||
        !Number.isFinite(btw) || btw < 0
    ) {
        toonMelding("⚠️ Controleer de ingevulde bedragen");
        return;
    }

    // Bestaande instellingen bijwerken
    document.getElementById("priveTarief").value = prive;
    document.getElementById("groepTarief").value = groep;
    document.getElementById("btwPercentage").value = btw;

    slaInstellingenOp();

    closePopup();

    toonMelding("✅ Instellingen opgeslagen");
}


// Tijdvelden tonen/verbergen bij lesblok
function updatePopupBlokType() {

    const type = document.getElementById("popupBlokType").value;

    document.getElementById("popupTijdBlok").style.display =
        type === "vakantie" ? "none" : "block";
}

// Lesblok registreren vanuit popup
function registreerPopupBlok() {

    const startDatum =
        document.getElementById("popupBlokStartDatum").value;

    const eindDatum =
        document.getElementById("popupBlokEindDatum").value;

    const type =
        document.getElementById("popupBlokType").value;

    if (!startDatum || !eindDatum || startDatum > eindDatum) {
        toonMelding("⚠️ Controleer de start- en einddatum");
        return;
    }

    if (type !== "vakantie") {

        const start =
            document.getElementById("popupBlokStart").value;

        const einde =
            document.getElementById("popupBlokEinde").value;

        const interval = Number(
            document.getElementById("popupBlokInterval").value
        );

        if (!start || !einde || start >= einde || interval <= 0) {
            toonMelding("⚠️ Controleer tijden en interval");
            return;
        }
    }

    // Waarden doorgeven aan de bestaande registratie
    document.getElementById("blokType").value = type;

    document.getElementById("blokStartDatum").value = startDatum;
    document.getElementById("blokEindDatum").value = eindDatum;

    if (type !== "vakantie") {

        document.getElementById("blokStart").value =
            document.getElementById("popupBlokStart").value;

        document.getElementById("blokEinde").value =
            document.getElementById("popupBlokEinde").value;

        document.getElementById("blokInterval").value =
            document.getElementById("popupBlokInterval").value;
    }

    registreerBlok();

    closePopup();
}


function openLesToevoegen() {

    document
        .getElementById(
            "beheerContainer"
        )
        .scrollIntoView({
            behavior: "smooth"
        });

}

function openTarieven() {

    document
        .getElementById(
            "priveTarief"
        )
        .scrollIntoView({
            behavior: "smooth"
        });

}

function openLesblok() {

    document
        .getElementById(
            "blokType"
        )
        .scrollIntoView({
            behavior: "smooth"
        });

}

function toggleDatum(datum) {

    openDatums[datum] =
        !openDatums[datum];

    updateDashboard();

}

let lesblokOpen = false;

function toggleLesblok() {

    lesblokOpen =
        !lesblokOpen;

    document.getElementById(
        "lesblokInhoud"
    ).style.display =
        lesblokOpen
            ? "block"
            : "none";

    document.getElementById(
        "lesblokPijl"
    ).innerText =
        lesblokOpen
            ? "▼"
            : "▶";
}

function toggleSeizoensDag(dag) {

    openSeizoensDagen[dag] =
        !openSeizoensDagen[dag];

    updateDashboard();
}

function vorigeWeek() {

    weekOffset--;

    updateDashboard();
}

function volgendeWeek() {

    weekOffset++;

    updateDashboard();
}

function registreerLes() {

    const type =
        document.getElementById(
            "lesType"
        ).value;

    if (bewerkIndex !== null) {

        lessen[bewerkIndex].datum =
            document.getElementById(
                "lesDatum"
            ).value;

        lessen[bewerkIndex].tijdstip =
            document.getElementById(
                "lesTijd"
            ).value;

        lessen[bewerkIndex].type =
            type;

        lessen[bewerkIndex].tarief =
            type === "prive"
                ? priveTarief
                : type === "groep"
                ? groepTarief
                : 0;

        bewerkIndex = null;

        opslaan();

        updateDashboard();

        toonMelding(
            "✅ Les gewijzigd"
        );

        return;
    }

    voegLesToe(type);
}

function updateTariefPreview() {

    const type =
        document.getElementById(
            "lesType"
        ).value;

    let tekst = "";

    if (type === "prive") {

        tekst = euro(priveTarief);

    } else if (type === "groep") {

        tekst = euro(groepTarief);

    } else {

        tekst = "-";
    }

    document.getElementById(
        "tariefPreview"
    ).innerText =
        tekst;
}

function updateBlokType() {

    const type =
        document.getElementById(
            "blokType"
        ).value;

    const tijdBlok =
        document.getElementById(
            "tijdBlok"
        );

   if (
    type === "vakantie"
) {

        tijdBlok.style.display =
            "none";

    } else {

        tijdBlok.style.display =
            "block";
    }
}

function registreerUitval() {

    const type =
        document.getElementById(
            "uitvalType"
        ).value;

    const start =
        document.getElementById(
            "uitvalStart"
        ).value;

    const einde =
        document.getElementById(
            "uitvalEinde"
        ).value;

    if (!start || !einde) {

        toonMelding(
            "⚠️ Vul een start- en einddatum in"
        );

        return;
    }

    let huidigeDatum =
        new Date(start);

    const eindDatum =
        new Date(einde);

    let teller = 0;

    while (
        huidigeDatum <= eindDatum
    ) {

        lessen.push({

            datum:
                huidigeDatum
                    .toISOString()
                    .split("T")[0],

            tijdstip: "Uitval",

            type: type,

            tarief: 0

        });

        teller++;

        huidigeDatum.setDate(
            huidigeDatum.getDate() + 1
        );
    }

    opslaan();

    updateDashboard();

    toonMelding(
        `✅ ${teller} uitvaldagen toegevoegd`
    );
}

function registreerBlok() {

    const type =
        document.getElementById(
            "blokType"
        ).value;

    const startDatum =
    document.getElementById(
        "blokStartDatum"
    ).value;

    const eindDatum =
    document.getElementById(
        "blokEindDatum"
    ).value;

    const start =
        document.getElementById(
            "blokStart"
        ).value;

    const einde =
        document.getElementById(
            "blokEinde"
        ).value;

    const interval =
        Number(
            document.getElementById(
                "blokInterval"
            ).value
        );
    if (
    type === "vakantie"
) {

    let dag =
        new Date(startDatum);

    const laatsteDag =
        new Date(eindDatum);

    let teller = 0;

    while (dag <= laatsteDag) {

        lessen.push({

            datum:
                dag
                    .toISOString()
                    .split("T")[0],

            tijdstip:
                type === "vakantie"
                    ? "Vakantie"
                    : "Afwezig",

            type: type,

            tarief: 0

        });

        teller++;

        dag.setDate(
            dag.getDate() + 1
        );
    }

    opslaan();

    updateDashboard();

    toonMelding(
        `✅ ${teller} dagen toegevoegd`
    );

    return;
}

  if (
    !startDatum ||
    !eindDatum ||
    !start ||
    !einde
) {

    toonMelding(
        "⚠️ Vul alle velden in"
    );

    return;
}


    let teller = 0;

let dag =
    new Date(startDatum);

const laatsteDag =
    new Date(eindDatum);

while (dag <= laatsteDag) {

    const datumString =
        dag
            .toISOString()
            .split("T")[0];

    let huidige =
        new Date(
            `${datumString}T${start}`
        );

    const eind =
        new Date(
            `${datumString}T${einde}`
        );

    while (huidige < eind) {

        const tijdstip =
            huidige
                .toLocaleTimeString(
                    "nl-NL",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

        lessen.push({

            datum: datumString,

            tijdstip: tijdstip,

            type: type,

            tarief:
                type === "prive"
                    ? priveTarief
                    : type === "groep"
                    ? groepTarief
                    : 0

        });

        huidige.setMinutes(
            huidige.getMinutes() +
            interval
        );

        teller++;
    }

    dag.setDate(
        dag.getDate() + 1
    );
}
    opslaan();

    updateDashboard();

    toonMelding(
        `✅ ${teller} lessen toegevoegd`
    );
}

// =========================
// Reset vandaag
// =========================

function resetVandaag() {

    const bevestiging =
        confirm(
            "Weet je zeker dat je alle lessen van vandaag wilt verwijderen?"
        );

    if (!bevestiging) return;

    lessen =
        lessen.filter(
            les => les.datum !== vandaag()
        );

    opslaan();

    updateDashboard();
}

function resetAlleLessen() {

    const bevestiging = confirm(
        "Weet je zeker dat je ALLE lessen wilt verwijderen?"
    );

    if (!bevestiging) {
        return;
    }

    lessen = [];

    opslaan();

    updateDashboard();
}

// =========================
// Instellingen opslaan
// =========================

function slaInstellingenOp() {

    priveTarief =
        Number(
            document.getElementById("priveTarief").value
        );

    groepTarief =
        Number(
            document.getElementById("groepTarief").value
        );

    btwPercentage =
        Number(
            document.getElementById("btwPercentage").value
        );

    localStorage.setItem(
        "priveTarief",
        priveTarief
    );

    localStorage.setItem(
        "groepTarief",
        groepTarief
    );

    localStorage.setItem(
        "btwPercentage",
        btwPercentage
    );

    updateDashboard();

    updateTariefPreview();
}


// =========================
// Dashboard
// =========================

function updateDashboard() {

    // Vandaag

    const lessenVandaag =
        lessen.filter(
            les => les.datum === vandaag()
        );

    const priveAantal =
        lessenVandaag.filter(
            les => les.type === "prive"
        ).length;

    const groepAantal =
        lessenVandaag.filter(
            les => les.type === "groep"
        ).length;

    let omzetIncl = 0;

    lessenVandaag.forEach(les => {

        omzetIncl += Number(
            les.tarief || 0
        );

    });

    const omzetExcl =
        omzetIncl /
        (1 + btwPercentage / 100);

    const btw =
        omzetIncl - omzetExcl;

let vandaagHtml = "";

lessenVandaag.forEach((les) => {

    
const naam =
    les.type === "prive"
        ? "🎾 Privéles"
        : les.type === "groep"
        ? "👥 Groepsles"
        : les.type === "weersomstandigheden"
        ? "🌧️ Weer"
        : les.type === "vakantie"
        ? "🏖️ Vakantie"
        : les.type === "trainer_afwezig"
        ? "🚫 Trainer afwezig"
        : "🤒 Leerling afwezig";


    vandaagHtml += `

 <div class="les-item-compact">

    <span class="vandaag-info">

        🕒 ${les.tijdstip}
        ·
        ${naam}

    </span>

    <span class="vandaag-bedrag">

        ${les.tarief > 0
            ? euro(les.tarief)
            : ""}

    </span>

            <button
                class="verwijder-klein"
                onclick="verwijderLes(${lessenVandaag.indexOf(les)})">

                🗑️

            </button>

        </div>

    `;

});

document.getElementById(
    "lessenLijst"
).innerHTML =
    vandaagHtml;
    
    // Totaal alle lessen

    let totaalOmzet = 0;

    lessen.forEach(les => {

        totaalOmzet += Number(
            les.tarief || 0
        );

    });

    const totaalOmzetExcl =
        totaalOmzet /
        (1 + btwPercentage / 100);

    const totaalBTW =
        totaalOmzet -
        totaalOmzetExcl;


    // Dashboard cijfers

    document.getElementById("priveAantal").innerText =
    priveAantal;

    document.getElementById("groepAantal").innerText =
    groepAantal;
    
    document.getElementById("kaartExcl").innerText =
        euro(omzetExcl);

    document.getElementById("kaartBTW").innerText =
        euro(btw);

    document.getElementById("kaartIncl").innerText =
        euro(omzetIncl);

    document.getElementById("kaartTotaalOmzet").innerText =
        euro(totaalOmzet);

    document.getElementById("kaartTotaalBTW").innerText =
        euro(totaalBTW);

    document.getElementById("kaartTotaalLessen").innerText =
        lessen.length;

    document.getElementById("alleLessenTitel").innerText =
    `📚 Alle lessen (${lessen.length})`;


// Alle lessen gegroepeerd

let alleLessenHtml = "";

const dagen = {
    maandag: [],
    dinsdag: [],
    woensdag: [],
    donderdag: [],
    vrijdag: [],
    zaterdag: [],
    zondag: []
};

[...lessen]
    .reverse()
    .forEach(les => {

        const dag =
            new Date(les.datum)
                .toLocaleDateString(
                    "nl-NL",
                    {
                        weekday: "long"
                    }
                )
                .toLowerCase();

        if (dagen[dag]) {

            dagen[dag].push(les);
        }
    });

Object.entries(dagen)
.forEach(([dag, dagLessen]) => {

dagLessen.sort((a, b) => {

    return new Date(
        b.datum + " " + b.tijdstip
    ) - new Date(
        a.datum + " " + a.tijdstip
    );

});
    
    alleLessenHtml += `

        <div
            class="dag-header"
            onclick="toggleDag('${dag}')">

            ${openDagen[dag] ? "▼" : "▶"}

            ${dag.charAt(0).toUpperCase() + dag.slice(1)}

            (${dagLessen.length})

        </div>

    `;

    if (!openDagen[dag]) {

        return;
    }

    let vorigeDatum = "";

    dagLessen.forEach(les => {

        if (les.datum !== vorigeDatum) {

alleLessenHtml += `

<div
    class="datum-header"
    onclick="toggleDatum('${les.datum}')">

    ${openDatums[les.datum] ? "▼" : "▶"}

    📅 ${formatteerDatum(les.datum)}

</div>

`;
            vorigeDatum = les.datum;
         
        }
        
if (!openDatums[les.datum]) {

    return;

}
        
const naam =
    les.type === "prive"
        ? "🎾 Privéles"
        : les.type === "groep"
        ? "👥 Groepsles"
        : les.type === "weersomstandigheden"
        ? "🌧️ Weer"
        : les.type === "vakantie"
        ? "🏖️ Vakantie"
        : les.type === "trainer_afwezig"
        ? "🚫 Trainer afwezig"
        : "🤒 Leerling afwezig";


       alleLessenHtml += `

<div class="les-item-compact">

    <span class="les-tijdstip">

        ${les.tijdstip}

    </span>

   <div class="les-info">

    <span class="les-naam">
        ${naam}
    </span>

    <span class="les-bedrag">
        ${les.tarief > 0
            ? `€${les.tarief}`
            : ""}
    </span>

</div>

    <div class="les-acties">

        <button
            class="bewerk-knop"
            onclick="toggleBewerken(${lessen.indexOf(les)})">

            ✏️

        </button>

        <button
            class="verwijder-klein"
            onclick="verwijderHistorischeLes(${lessen.indexOf(les)})">

            🗑️

        </button>

    </div>

</div>

`;
        
if (
    openBewerkLes ===
    lessen.indexOf(les)
) {

    alleLessenHtml += `

        <div class="bewerk-paneel">

            <label>Datum</label>

            <input
                type="date"
                id="edit-datum-${lessen.indexOf(les)}"
                value="${les.datum}">

            <label>Tijdstip</label>

            <input
                type="time"
                id="edit-tijd-${lessen.indexOf(les)}"
                value="${les.tijdstip !== "Uitval" ? les.tijdstip : ""}">

<label>Type</label>

<select
    id="edit-type-${lessen.indexOf(les)}"
    onchange="updateEditTarief(${lessen.indexOf(les)})">

    <option
        value="prive"
                    ${les.type === "prive" ? "selected" : ""}>

                    🎾 Privéles

                </option>

                <option
                    value="groep"
                    ${les.type === "groep" ? "selected" : ""}>

                    🎾 Groepsles

                </option>

                <option
                    value="weersomstandigheden"
                    ${les.type === "weersomstandigheden" ? "selected" : ""}>

                    🌧️ Weer

                </option>

                <option
                    value="vakantie"
                    ${les.type === "vakantie" ? "selected" : ""}>

                    🏖️ Vakantie

                </option>

                <option
                    value="afwezig"
                    ${les.type === "afwezig" ? "selected" : ""}>

                    🤒 Leerling afwezig

                </option>

            </select>

            <label>Tarief</label>

            <input
                type="number"
                id="edit-tarief-${lessen.indexOf(les)}"
                value="${les.tarief}">

            <button
                class="opslaan-button"
                onclick="opslaanLes(${lessen.indexOf(les)})">

                💾 Opslaan

            </button>

        </div>

    `;
}

    });

});
     
document.getElementById(
    "alleLessenLijst"
).innerHTML =
    alleLessenHtml;

    
// Seizoensmonitor

const weekdagen = {
    maandag: {},
    dinsdag: {},
    woensdag: {},
    donderdag: {},
    vrijdag: {},
    zaterdag: {},
    zondag: {}
};

lessen.forEach(les => {

  
if (
    les.type === "uitgevallen" ||
    les.type === "weersomstandigheden" ||
    les.type === "vakantie" ||
    les.type === "afwezig" ||
    les.type === "trainer_afwezig"
) {
    return;
}


  const dag =
    new Date(les.datum)
        .toLocaleDateString(
            "nl-NL",
            {
                weekday: "long"
            }
        )
        .toLowerCase();

const tijd =
    les.tijdstip;

if (!weekdagen[dag]) {
    return;
}

if (!weekdagen[dag][tijd]) {

    weekdagen[dag][tijd] = 0;
}

weekdagen[dag][tijd]++;

});

let seizoenHtml = "";

Object.entries(weekdagen)
    .forEach(([dag, tijden]) => {

        if (Object.keys(tijden).length === 0) {

            return;
        }

       seizoenHtml += `

    <div
        class="dag-header"
        onclick="toggleSeizoensDag('${dag}')">

        ${openSeizoensDagen[dag] ? "▼" : "▶"}

        ${dag.charAt(0).toUpperCase() + dag.slice(1)}

        (${Object.keys(tijden).length})

    </div>

`;

if (!openSeizoensDagen[dag]) {

    return;
}
        Object.entries(tijden)
            .sort()
            .forEach(([tijd, aantal]) => {

                seizoenHtml += `
                    <div class="regel">

                        <span>${tijd}</span>

<div class="voortgang">

    <div
        class="voortgang-balk"
        style="width: ${(aantal / seizoenTotaal) * 100}%">
    </div>

</div>

<strong>
    ${aantal}/${seizoenTotaal}
</strong>

                    </div>
                `;
            });

    });

document.getElementById(
    "seizoensMonitor"
).innerHTML =
    seizoenHtml;

}
    
// =========================
// Helpers
// =========================

function opslaan() {

    localStorage.setItem(
        "lessen",
        JSON.stringify(lessen)
    );
}

function vandaag() {

    return new Date()
        .toISOString()
        .split("T")[0];
}

function huidigeTijd() {

    return new Date()
        .toLocaleTimeString(
            "nl-NL",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
}

function euro(bedrag) {

    return Number(bedrag)
        .toLocaleString(
            "nl-NL",
            {
                style: "currency",
                currency: "EUR"
            }
        );
}

function toonDatum() {

    const opties = {

        weekday: "long",

        day: "numeric",

        month: "long"
    };

    document.getElementById("datum").innerText =
        new Date()
            .toLocaleDateString(
                "nl-NL",
                opties
            )
}

function formatteerDatum(datum) {

    return new Date(datum)
        .toLocaleDateString(
            "nl-NL",
            {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

}

function closePopup() {

    document
    .getElementById("overlay")
    .classList.remove("open");

    document
    .getElementById("fabSubMenu")
    .classList.remove("open");
}



function registreerPopupLes() {

    const datum = document.getElementById("popupDatum").value;
    const tijd = document.getElementById("popupTijd").value;
    const type = document.getElementById("popupType").value;

    const isNormaleLes =
        type === "prive" || type === "groep";

    const tarief = isNormaleLes
        ? (type === "prive" ? priveTarief : groepTarief)
        : 0;

    lessen.push({
        datum: datum,
        tijdstip: tijd,
        type: type,
        tarief: tarief
    });

    opslaan();
    updateDashboard();

    // Volgende hele uur instellen
    const [uren, minuten] = tijd.split(":").map(Number);
    const volgendeTijd = new Date();
    volgendeTijd.setHours(uren, minuten + 60, 0, 0);

    const nieuweTijd =
        String(volgendeTijd.getHours()).padStart(2, "0") +
        ":" +
        String(volgendeTijd.getMinutes()).padStart(2, "0");

    document.getElementById("popupTijd").value = nieuweTijd;

    // Melding tonen, popup open laten
    toonMelding(
        isNormaleLes
            ? "✅ Les toegevoegd"
            : "✅ Afwezigheid geregistreerd"
    );
}



function updatePopupTarief() {

    const type = document.getElementById("popupType").value;
    const tariefElement = document.getElementById("popupTarief");

    if (type === "prive") {
        tariefElement.textContent = euro(priveTarief);
    } 
    else if (type === "groep") {
        tariefElement.textContent = euro(groepTarief);
    } 
    else {
        tariefElement.textContent = "€ 0,00";
    }
}


// Sluit het zwevende actiemenu bij een tik erbuiten
document.addEventListener("click", function(event) {

    const menu = document.getElementById("fabMenu");
    const knop = document.getElementById("fab");
    const popup = document.getElementById("fabSubMenu");
    const overlay = document.getElementById("overlay");

    if (
        menu.classList.contains("open") &&
        !menu.contains(event.target) &&
        !knop.contains(event.target) &&
        !popup.contains(event.target) &&
        !overlay.contains(event.target)
    ) {
        event.preventDefault();
        event.stopPropagation();

        menu.classList.remove("open");
        knop.textContent = "+";
    }

}, true);


