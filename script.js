function berekenTotaal() {

    const TARIEF_PRIVE = 63;
    const TARIEF_GROEP = 67;

    let privelessen = Number(document.getElementById("Priveles").value);
    let groepslessen = Number(document.getElementById("Groepsles").value);

    let omzetPriveIncl = privelessen * TARIEF_PRIVE;
    let omzetGroepIncl = groepslessen * TARIEF_GROEP;

    let omzetIncl = omzetPriveIncl + omzetGroepIncl;

    let omzetExcl = omzetIncl / 1.21;

    let btw = omzetIncl - omzetExcl;

    document.getElementById("resultaatTotaal").innerHTML =
        `
        <h3>🎾 Overzicht</h3>

        Privé omzet: €${omzetPriveIncl.toFixed(2)}<br>
        Groepsomzet: €${omzetGroepIncl.toFixed(2)}<br><br>

        Omzet incl. BTW: €${omzetIncl.toFixed(2)}<br>
        Omzet excl. BTW: €${omzetExcl.toFixed(2)}<br>
        BTW: €${btw.toFixed(2)}
        `;
}