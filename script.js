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
    maandag: true,
    dinsdag: false,
    woensdag: false,
    donderdag: false,
    vrijdag: true,
    zaterdag: false,
    zondag: false
};

let weekOffset = 0;

let bewerkIndex = null;

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

function toggleDag(dag) {

    openDagen[dag] =
        !openDagen[dag];

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
function bewerkLes(index) {

    const les = lessen[index];

    bewerkIndex = index;

    document.getElementById(
        "lesDatum"
    ).value =
        les.datum;

    document.getElementById(
        "lesTijd"
    ).value =
        les.tijdstip;

    document.getElementById(
        "lesType"
    ).value =
        les.type;

    updateTariefPreview();

    toonMelding(
        "✏️ Les geladen voor bewerken"
    );
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


    // Vandaag geregistreerd

    let html = "";

    lessenVandaag.forEach((les, index) => {

       const naam =
    les.type === "prive"
        ? "🎾 Privéles"
        : les.type === "groep"
        ? "🎾 Groepsles"
        : les.type === "weersomstandigheden"
        ? "🌧️ weersomstandigheden"
        : les.type === "vakantie"
        ? "🏖️ Vakantie"
        : "🤒 Leerling afwezig";
        html += `
            <div class="les-item">

                <span>
                    🕒 ${les.tijdstip}
                    |
                    ${naam}
                    |
                    ${euro(les.tarief)}
                </span>

                <button
                    class="verwijder-knop"
                    onclick="verwijderLes(${index})">

                    Verwijder

                </button>

            </div>
        `;

    });

    document.getElementById("lessenLijst").innerHTML =
        html;

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

    </span>

<button
    class="bewerk-knop"
    onclick="bewerkLes(${lessen.indexOf(les)})">

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
            <div class="dag-kop">
                📅 ${dag.charAt(0).toUpperCase() + dag.slice(1)}
            </div>
        `;
        Object.entries(tijden)
            .sort()
            .forEach(([tijd, aantal]) => {

                seizoenHtml += `
                    <div class="regel">

                        <span>${tijd}</span>

                       <strong>
                            Les ${aantal} van ${seizoenTotaal}
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
