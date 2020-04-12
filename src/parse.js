import Papa from "papaparse";

function fixTrailing(n, l) {
  if (!n || n === "") {
    return "";
  }

  n = String(n).replace(/\s/g, "");
  return n.length < l ? "0" + n : n;
}

function fixEncoding(str = "") {
  return str.replace(/�/g, "é").normalize();
}

export const parse = (csv) => {
  const orders = [];
  const parsedCsv = Papa.parse(csv);

  for (let idx = 1; idx < parsedCsv.data.length; idx++) {
    let line = parsedCsv.data[idx];

    // if (line[0] === "13056") {
    //   debugger;
    // }

    let isEmail = line[12].match("@");
    let fixCol = isEmail && isEmail.length ? 0 : 1;
    //   isEmail = line[12 + fixCol].match("@");
    //   fixCol = isEmail && isEmail.length ? 0 : 2;

    const order = {
      NUM_COMMANDE: line[0],
      DATE_COMMANDE: line[1],
      NOM: fixEncoding(line[6]),
      PRENOM: fixEncoding(line[7]),
      ADRESSE: fixEncoding(line[8]),
      CP: fixTrailing(line[9], 6),
      VILLE: fixEncoding(line[10]),
      PAYS: line[11],
      EMAIL: line[12 - fixCol],
      TEL: fixTrailing(line[13 - fixCol], 10),
      PORTABLE: fixTrailing(line[14 - fixCol], 10),
    };

    const details = [];

    idx++;
    line = parsedCsv.data[idx];

    while (line && line[0] != "FRAIS DE PORT COMMANDE") {
      details.push({
        ARTICLE: line[2],
        QTY: line[3],
        PU: line[4],
        TOTAL: line[5],
      });

      idx++;
      line = parsedCsv.data[idx];
    }

    order.FRAIS_DE_PORT = parseFloat(line[6] || 0);
    order.DETAILS = details;

    idx++;
    //   console.log(order);
    orders.push(order);
  }

  return orders;
};

export const print = (orders) => {
  const csv = [];

  csv.push(["NUM_COMMANDE", "ITEM", "QTY"].join(";"));

  orders.forEach((o) => {
    o.DETAILS.forEach((a) => {
      csv.push([o.NUM_COMMANDE, a.ARTICLE, a.QTY].join(";"));
    });
  });

  return csv.join("\n");
};
