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
        "🌧️ Weersomstandigheden geregistreerd"
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
            ? "🌧️ Weersomstandigheden"
            : les.type === "vakantie"
            ? "🏖️ Vakantie"
            : "🤒 Leerling afwezig";

    vandaagHtml += `

        <div class="les-item">

            🕒 ${les.tijdstip}
            ·
            ${naam}

            ${les.tarief > 0
                ? " · " + euro(les.tarief)
                : ""}

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

                <div class="datum-header">

                    📅 ${formatteerDatum(les.datum)}

                </div>

            `;

            vorigeDatum = les.datum;
        }

        const naam =
            les.type === "prive"
                ? "🎾 Privéles"
                : les.type === "groep"
                ? "🎾 Groepsles"
                : les.type === "weersomstandigheden"
                ? "🌧️ Weersomstandigheden"
                : les.type === "vakantie"
                ? "🏖️ Vakantie"
                : "🤒 Leerling afwezig";

        alleLessenHtml += `

            <div class="les-item-compact">

                <span>

                    🕒 ${les.tijdstip}

                </span>

                <div class="les-acties">

                   <span>

    ${naam}

    <span class="les-tarief">

        ${les.tarief > 0
            ? " · " + euro(les.tarief)
            : ""}

    </span>

</span>

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

                    🌧️ Weersomstandigheden

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
    les.type === "afwezig"
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
