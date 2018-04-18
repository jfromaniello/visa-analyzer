const _ = require('lodash');
const moment = require('moment');
const parser = require('./lib/parser');

moment.locale('es');

parser.parse(process.argv[2], (err, items) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
    return;
  }
  const totalArs = _.sum(items.map(i => (i.currency === 'ars' ? i.amount : 0)));
  const totalUsd = _.sum(items.map(i => (i.currency === 'usd' ? i.amount : 0)));

  const totalArsDues = _.sumBy(items.filter(i => i.currency === 'ars' && i.dues), 'amount');
  const totalArsNotDues = _.sumBy(items.filter(i => i.currency === 'ars' && !i.dues), 'amount');
  const totalUsdNotDues = _.sumBy(items.filter(i => i.currency === 'usd' && !i.dues), 'amount');

  const maxDues = _.max(items.map(i => (i.dues ? i.dues.total - i.dues.paid : 0)));
  const projection = _.range(0, maxDues).map((month) => {
    const dues = items.filter(i => i.dues).filter(i => i.dues.total >= i.dues.paid + month);
    return _.sumBy(dues, 'amount');
  }).reduce((r, amount, index) => {
    if (index === 0) { return r; }
    const period = moment().add(index, 'month').format('MMM YYYY');
    return Object.assign(r, { [period]: amount });
  }, {});

  const duesEndingThisMonth = _.sumBy(items.filter(i => i.dues && i.dues.total === i.dues.paid), 'amount');

  console.log(`
💰Total en Pesos: ${totalArs.toFixed(2)}
💵Total en Dolares: ${totalUsd.toFixed(2)}

🤦🏽Total de consumos en una cuota en pesos: ${totalArsNotDues.toFixed(2)}
🤦🏽Total de consumos en una cuota en usd: ${totalUsdNotDues.toFixed(2)}
🤮 Total de las cuotas a pagar este mes: ${totalArsDues.toFixed(2)}

🙏🏼Total de las cuotas que terminan este mes y no vendran el próximo 🙌🏼: ${duesEndingThisMonth.toFixed(2)}

🙌🏽Proyección de cuotas:

${Object.keys(projection).map(p => `- ${p}:${_.padStart(projection[p].toFixed(2), 10, ' ')}`).join('\n')}
`);
  // console.log(JSON.stringify(items, null, 2));
});