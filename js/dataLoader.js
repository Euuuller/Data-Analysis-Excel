(function () {
  const textToRows = (text) =>
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split(",").map((v) => v.trim()));

  const loadCSVFromFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(textToRows(reader.result || ""));
      reader.onerror = reject;
      reader.readAsText(file, "utf-8");
    });

  const loadCSVFromPath = async (path) => {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Não foi possível carregar o CSV.");
    const text = await res.text();
    return textToRows(text);
  };

  /**
   * Normaliza o CSV para um formato amigável de cohort.
   * Retorno esperado (exemplo):
   * {
   *   headers: ["Month", "Start 2014", 0, 1, ...],
   *   rows: [{ label: "Jan", values: [32, 3, ...] }, ...]
   * }
   * Ajuste conforme a estrutura real do CSV.
   */
  const normalizeCohort = (rows) => {
    if (!rows || !rows.length) return { headers: [], rows: [] };
    const headers = rows[0];
    const dataRows = rows.slice(1).map((r) => ({
      label: r[0],
      start: r[1],
      values: r.slice(2).map((v) => Number(v.replace(",", ".") || 0)),
    }));
    return { headers, rows: dataRows };
  };

  window.DataLoader = {
    loadCSVFromFile,
    loadCSVFromPath,
    normalizeCohort,
  };
})();

