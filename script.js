let privelessen = 0;
let groepslessen = 0;

// Gegevens ophalen uit opslag
let opgeslagenPrive = localStorage.getItem("privelessen");
let opgeslagenGroep = localStorage.getItem("groepslessen");

if (opgeslagenPrive) {
    privelessen = Number(opgeslagenPrive);
}

if (opgeslagenGroep) {
    groepslessen = Number(opgeslagenGroep);
}

function voegPriveToe() {
    privelessen++;

    localStorage.setItem(
        "privelessen",
        privelessen
    );

    updateDashboard();
}

function voegGroepToe() {
    groepslessen++;

    localStorage.setItem(
        "groepslessen",
        groepslessen
    );

    updateDashboard();
}

function resetVandaag() {

    privelessen = 0;
    groepslessen = 0;

    localStorage.removeItem("privelessen");
    localStorage.removeItem("groepslessen");

    updateDashboard();
}

function updateDashboard() {

    const TARIEF_PRIVE = 63;
    const TARIEF_GROEP = 67;

    let omzetPriveIncl = privelessen * TARIEF_PRIVE;
    let omzetGroepIncl = groepslessen * TARIEF_GROEP;

    let omzetIncl = omzetPriveIncl + omzetGroepIncl;

    let omzetExcl = omzetIncl / 1.21;

    let btw = omzetIncl - omzetExcl;

    document.getElementById("dashboard").innerHTML = `
        <h2>Vandaag</h2>

        Privélessen: ${privelessen}<br>
        Groepslessen: ${groepslessen}<br><br>

        Omzet incl. BTW:
        €${omzetIncl.toLocaleString('nl-NL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}<br>

        Omzet excl. BTW:
        €${omzetExcl.toLocaleString('nl-NL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}<br>

        BTW:
        €${btw.toLocaleString('nl-NL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}
    `;
}

updateDashboard();
