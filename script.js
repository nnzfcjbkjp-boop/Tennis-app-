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

    document.getElementById("omzetVandaag").innerText =
        euro(omzetIncl);

    document.getElementById("omzetExcl").innerText =
        euro(omzetExcl) + " excl. btw";

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

    document.getElementById("priveTariefKnop").innerText =
        euro(priveTarief);

    document.getElementById("groepTariefKnop").innerText =
        euro(groepTarief);


    // Vandaag geregistreerd

    let html = "";

    lessenVandaag.forEach((les, index) => {

       const naam =
    les.type === "prive"
        ? "🎾 Privéles"
        : les.type === "groep"
        ? "🎾 Groepsles"
        : "🚫 Uitgevallen";

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


   // Alle lessen
let alleLessenHtml = "";

const lessenWeergave =
    alleLessenOpen
        ? [...lessen].reverse()
        : [...lessen].reverse().slice(0, 10);

lessenWeergave.forEach((les, index) => {

       const naam =
    les.type === "prive"
        ? "🎾 Privéles"
        : les.type === "groep"
        ? "🎾 Groepsles"
        : "🚫 Uitgevallen";

        alleLessenHtml += `
            <div class="les-item les-item-alle">

                <span>
                    📅 ${formatteerDatum(les.datum)}
                    •
                    🕒 ${les.tijdstip}
                    •
                    ${naam}
                    •
                    ${euro(les.tarief)}
                </span>

                <button
                    class="verwijder-klein"
                    onclick="verwijderHistorischeLes(${lessen.length - 1 - index})">

                    🗑

                </button>

            </div>
        `;
    });

document.getElementById(
    "alleLessenLijst"
).innerHTML =
    alleLessenHtml;

    document.querySelector(
    ".toon-meer-button"
).innerText =
    alleLessenOpen
        ? "Toon minder"
        : `Toon alle lessen (${lessen.length})`;

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

    if (les.type === "uitgevallen") {
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
