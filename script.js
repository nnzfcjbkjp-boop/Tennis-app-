// Instellingen laden

let priveTarief =
    Number(localStorage.getItem("priveTarief")) || 63;

let groepTarief =
    Number(localStorage.getItem("groepTarief")) || 67;

let btwPercentage =
    Number(localStorage.getItem("btwPercentage")) || 21;

let lessen =
    JSON.parse(localStorage.getItem("lessen")) || [];


// Pagina initialiseren

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
    new Date().toLocaleTimeString(
        "nl-NL",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

updateDashboard();


// Les toevoegen

function voegLesToe(type) {

    alert("Les toevoegen werkt");

    const tarief =
        type === "prive"
        ? priveTarief
        : groepTarief;

    ...
}


    lessen.push({

        datum:
            document.getElementById("lesDatum").value,

        tijdstip:
            document.getElementById("lesTijd").value,

        type: type,

        tarief: tarief,

        btwPercentage: btwPercentage

    });

    opslaan();

    updateDashboard();
}


// Les verwijderen

function verwijderLes(index) {

    const lessenVandaag =
        lessen.filter(
            les => les.datum === vandaag()
        );

    const lesOmTeVerwijderen =
        lessenVandaag[index];

    const origineelIndex =
        lessen.indexOf(
            lesOmTeVerwijderen
        );

    if (origineelIndex > -1) {

        lessen.splice(
            origineelIndex,
            1
        );

        opslaan();

        updateDashboard();
    }
}


// Vandaag resetten

function resetVandaag() {

    if (
        !confirm(
            "Weet je zeker dat je alle lessen van vandaag wilt verwijderen?"
        )
    ) {
        return;
    }

    lessen =
        lessen.filter(
            les => les.datum !== vandaag()
        );

    opslaan();

    updateDashboard();
}


// Instellingen opslaan

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


// Dashboard verversen

function updateDashboard() {

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

    // Dashboard

    document.getElementById("priveAantal").innerText =
        priveAantal;

    document.getElementById("groepAantal").innerText =
        groepAantal;

    document.getElementById("omzetVandaag").innerText =
        euro(omzetIncl);

    document.getElementById("omzetExcl").innerText =
        euro(omzetExcl) +
        " excl. btw";

    document.getElementById("kaartExcl").innerText =
        euro(omzetExcl);

    document.getElementById("kaartBTW").innerText =
        euro(btw);

    document.getElementById("kaartIncl").innerText =
        euro(omzetIncl);

    // Tarieven op knoppen

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
            : "🎾 Groepsles";

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

    [...lessen]
        .reverse()
        .forEach((les) => {

            const naam =
                les.type === "prive"
                ? "🎾 Privéles"
                : "🎾 Groepsles";

            alleLessenHtml += `
                <div class="les-item">

                    <span>

                        📅 ${les.datum}

                        |

                        🕒 ${les.tijdstip}

                        |

                        ${naam}

                        |

                        ${euro(les.tarief)}

                    </span>

                </div>
            `;

        });

    document.getElementById(
        "alleLessenLijst"
    ).innerHTML =
        alleLessenHtml;
}


// Opslaan

function opslaan() {

    localStorage.setItem(
        "lessen",
        JSON.stringify(lessen)
    );
}


// Helpers

function vandaag() {

    return new Date()
        .toISOString()
        .split("T")[0];
}

function euro(bedrag) {

    return Number(bedrag).toLocaleString(
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
            .toUpperCase();
}
