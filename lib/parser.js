const extract = require('pdf-text-extract');
const moment = require('moment');

module.exports.parse = (path, callback) => {
  extract(path, { splitPages: false }, 'pdftotext', (err, text) => {
    if (err) {
      callback(err);
      return;
    }

    const lines = text.substring(text.indexOf('DETALLE DE TRANSACCION'), text.indexOf('LA SUMA DE'))
      .split('\n')
      .filter((line, index) => index !== 0 &&
          !!line.trim() &&
          !line.includes('SALDO ANTERIOR') &&
          !line.includes('SU PAGO EN PESOS'))
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
          amount: parseFloat(match[4].replace(/\./g, '').replace(/,/g, '.'), 10),
        };
      });

    callback(null, lines);
  });
};
