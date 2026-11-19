const TARIEF_PRIVE = 63;
const TARIEF_GROEP = 67;

let lessen =
    JSON.parse(localStorage.getItem("lessen")) || [];

toonDatum();
updateDashboard();

function voegLesToe(type){

    lessen.push({
        datum: vandaag(),
        type: type
    });

    opslaan();

    updateDashboard();
}

function resetVandaag(){

    lessen = lessen.filter(
        les => les.datum !== vandaag()
    );

    opslaan();

    updateDashboard();
}

function opslaan(){

    localStorage.setItem(
        "lessen",
        JSON.stringify(lessen)
    );
}

function vandaag(){

    return new Date().toISOString().split("T")[0];
}

function updateDashboard(){

    let vandaagLessen =
        lessen.filter(
            les => les.datum === vandaag()
        );

    let priveAantal =
        vandaagLessen.filter(
            les => les.type === "prive"
        ).length;

    let groepAantal =
        vandaagLessen.filter(
            les => les.type === "groep"
        ).length;

    let omzetIncl =
        (priveAantal * TARIEF_PRIVE) +
        (groepAantal * TARIEF_GROEP);

    let omzetExcl =
        omzetIncl / 1.21;

    document.getElementById("priveAantal").innerText =
        priveAantal;

    document.getElementById("groepAantal").innerText =
        groepAantal;

    document.getElementById("omzetVandaag").innerText =
        "€ " +
        omzetIncl.toLocaleString(
            "nl-NL",
            {
                minimumFractionDigits: 2
            }
        );

    document.getElementById("omzetExcl").innerText =
        "€ " +
        omzetExcl.toLocaleString(
            "nl-NL",
            {
                minimumFractionDigits: 2
            }
        ) +
        " excl. btw";
}

function toonDatum(){

    const vandaagDatum = new Date();

    const opties = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    document.getElementById("datumVandaag")
        .innerText =
        vandaagDatum
        .toLocaleDateString(
            "nl-NL",
            opties
        )
        .toUpperCase();
}
