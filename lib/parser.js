const extract = require('pdf-text-extract');
const moment = require('moment');

const parseSpanishFloat = n => parseFloat(n.replace(/\./g, '').replace(/,/g, '.'), 10);

function getInterestTax(detailLines) {
  const line = detailLines.find(l => l.includes('DB IVA'));
  if (!line) { return 0; }
  const match = line.match(/\d{2}.\d{2}.\d{2}\s*DB\sIVA\s*\$\s*\S*\s*\S*\s*(\S*)/)[1];
  return parseSpanishFloat(match);
}


function getBalance(detailLines) {
  const [previousBalanceArs] = detailLines.find(l => l.includes('SALDO ANTERIOR'))
    .trim()
    .match(/SALDO\sANTERIOR\s*(\S*)\s*(\S*)/)
    .filter((item, index) => index > 0)
    .map(parseSpanishFloat);
  const previousPaidArs = parseSpanishFloat(detailLines.find(l => l.includes('SU PAGO EN PESOS'))
    .trim()
    .match(/(\d{2}.\d{2}.\d{2})\s*SU\sPAGO\sEN\sPESOS\s*(\S*)-/)[2]);
  const dueTransferLine = detailLines.find(l => l.includes('TRANSFERENCIA DEUDA'));
  let dueTransfer = 0;
  if (dueTransferLine) {
    dueTransfer = parseSpanishFloat(dueTransferLine.trim().match(/(\d{2}.\d{2}.\d{2})\s*TRANSFERENCIA\sDEUDA\s*(\S*)\sTC\s(\S*)\s*(\S*)/)[4]);
  }
  const balance = (previousBalanceArs + dueTransfer) - previousPaidArs;
  return balance;
}

function getTax(detailLines) {
  let taxARS = 0;
  let taxUSD = 0;
  const sealTaxLine = detailLines.find(l => l.match(/IMPUESTO\sDE\sSELLOS\s*\$/g));
  if (sealTaxLine) {
    taxARS += parseSpanishFloat(sealTaxLine.match(/\d{2}.\d{2}.\d{2}\s*IMPUESTO\sDE\sSELLOS\s*\$\s*(\S*)/)[1]);
  }
  const sealTaxLineUSD = detailLines.find(l => l.match(/IMPUESTO\sDE\sSELLOS\s*USD/g));
  if (sealTaxLineUSD) {
    taxUSD += parseSpanishFloat(sealTaxLineUSD.match(/\d{2}.\d{2}.\d{2}\s*IMPUESTO\sDE\sSELLOS\s*USD\s*(\S*)/)[1]);
  }

  taxARS += getInterestTax(detailLines);

  return { taxARS, taxUSD };
}

function getItems(detailLines) {
  return detailLines
    .filter((line, index) => index !== 0 &&
      !!line.trim() &&
      !line.includes('SALDO ANTERIOR') &&
      !line.includes('SU PAGO EN PESOS') &&
      !line.includes('TRANSFERENCIA DEUDA'))
    .map(line => line.match(/(\d{2}.\d{2}.\d{2})\s*(\d{6})\*?\s*(.*)\s{20,70}(.*)/))
    .filter(match => match)
    .map((match) => {
      let detail = match[3].trim();
      let dues;
      let currency = 'ars';
      const duesMatch = detail.match(/(.*)\s*Cuota\s*(\d{2})\/(\d{2})\s*/);
      if (duesMatch) {
        const [, d, paid, total] = duesMatch;
        detail = d.trim();
        dues = { paid: parseInt(paid, 10), total: parseInt(total, 10) };
      }
      const usdMatch = detail.match(/(.*)\s*USD\s*(\S*)\s*/);
      if (usdMatch) {
        currency = 'usd';
        detail = usdMatch[1].trim();
      }
      return {
        dues,
        detail,
        date: moment(match[1], 'DD.MM.YY').toDate(),
        code: match[2],
        currency,
        amount: parseSpanishFloat(match[4]),
      };
    });
}

function getInterest(detailLines) {
  const line = detailLines.find(l => l.includes('INTERESES FINANCIACION'))
  if (!line) { return 0; }
  const match = line.match(/\d{2}.\d{2}.\d{2}\s*INTERESES\sFINANCIACION\s*\$\s*(\S*)/)[1];
  return parseSpanishFloat(match);
}

module.exports.parse = (path, callback) => {
  extract(path, { splitPages: false }, 'pdftotext', (err, text) => {
    if (err) {
      callback(err);
      return;
    }

    const detailLines = text.substring(text.indexOf('DETALLE DE TRANSACCION'), text.indexOf('LA SUMA DE')).split('\n');

    const balance = getBalance(detailLines);

    const interest = getInterest(detailLines);

    const { taxARS, taxUSD } = getTax(detailLines);

    const items = getItems(detailLines);

    callback(null, {
      taxARS,
      taxUSD,
      interest,
      balance,
      items,
    });
  });
};
