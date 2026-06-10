export const formatarData = (data) => {
    if (!data) return null;
    return new Date(data).toLocaleDateString("pt-BR");
};

export const formatarDataHora = (dataHora) => {
    if (!dataHora) return null;

    const [data, hora] = dataHora.split("T");
    const [ano, mes, dia] = data.split("-");
    const [h, m] = hora.split(":");

    return `${dia}/${mes}/${ano} ${h}:${m}`;
};

export const normalizarStringValorMonetario = (stringValor) => {
    if (stringValor === undefined || stringValor === null || stringValor === "") return null;

    stringValor = String(stringValor).trim();

    if (stringValor.includes(".") && stringValor.includes(",")) {
        if (stringValor.lastIndexOf(".") > stringValor.lastIndexOf(",")) {
            stringValor = stringValor.replace(/,/g, "");
        } else {
            stringValor = stringValor.replace(/\./g, "").replace(",", ".");
        }
    } 
    else if (stringValor.includes(",")) {
        stringValor = stringValor.replace(",", ".");
    }
    const formatoDecimalEstrito = /^\d+\.\d+$/;

    if (!formatoDecimalEstrito.test(stringValor)) {
        return null;
    }

    return stringValor;
};

