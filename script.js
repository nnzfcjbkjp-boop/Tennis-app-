let priveTarief =
    Number(localStorage.getItem("priveTarief")) || 63;

let groepTarief =
    Number(localStorage.getItem("groepTarief")) || 67;

let btwPercentage =
    Number(localStorage.getItem("btwPercentage")) || 21;

let lessen =
    JSON.parse(localStorage.getItem("lessen")) || [];

toonDatum();

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
document.getElementById("priveTarief").value =
    priveTarief;

document.getElementById("groepTarief").value =
    groepTarief;

document.getElementById("btwPercentage").value =
    btwPercentage;
document.getElementById("btwPercentage").value =
    btwPercentage;

function voegLesToe(type) {

    let tarief =
        type === "prive"
        ? priveTarief
        : groepTarief;

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

    updateDashboard();
}
function resetVandaag() {

    lessen = lessen.filter(
        les => les.datum !== vandaag()
    );

    opslaan();

    updateDashboard();
}

function verwijderLes(index) {

    let vandaagLessen =
        lessen.filter(
            les => les.datum === vandaag()
        );

    let lesOmTeVerwijderen =
        vandaagLessen[index];

    let origineelIndex =
        lessen.indexOf(
            lesOmTeVerwijderen
        );

    lessen.splice(
        origineelIndex,
        1
    );

    opslaan();

    updateDashboard();
}

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
function formatteerDatum(datum) {

    return new Date(datum).toLocaleDateString(
        "nl-NL",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}

function updateDashboard() {

    let lessenVandaag =
        lessen.filter(
            les => les.datum === vandaag()
        );

    let priveAantal =
        lessenVandaag.filter(
            les => les.type === "prive"
        ).length;

    let groepAantal =
        lessenVandaag.filter(
            les => les.type === "groep"
        ).length;

let omzetIncl = 0;

lessenVandaag.forEach(les => {

    if (les.tarief) {
        omzetIncl += les.tarief;
    }
document.getElementById("priveTariefKnop").innerText =
    euro(priveTarief);

document.getElementById("groepTariefKnop").innerText =
    euro(groepTarief);
});


let omzetExcl =
    omzetIncl /
    (1 + (btwPercentage / 100));

    let btw =
        omzetIncl - omzetExcl;

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
    let html = "";

lessenVandaag.forEach((les, index) => {

let naam =
    les.type === "prive"
    ? `📅 ${formatteerDatum(les.datum)} | 🕒 ${les.tijdstip} | 🎾 Privéles - ${euro(les.tarief)}`
    : `📅 ${formatteerDatum(les.datum)} | 🕒 ${les.tijdstip} | 🎾 Groepsles - ${euro(les.tarief)}`;
    html += `
        <div class="les-item">

            <span>${naam}</span>

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
}

function euro(bedrag) {

    return bedrag.toLocaleString(
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
