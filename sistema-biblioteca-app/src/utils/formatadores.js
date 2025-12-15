  const formatarData = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarDataHora = (dataHora) => {
    if (!dataHora) return null;

    const [data, hora] = dataHora.split("T");
    const [ano, mes, dia] = data.split("-");
    const [h, m] = hora.split(":");

    return `${dia}/${mes}/${ano} ${h}:${m}`;
  };