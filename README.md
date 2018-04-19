This is something I personally use to analyze PdF resumes from from www.visa.com.ar

## Installation

```
npm i -g jfromaniello/visa-analyzer
```
**Note:** this program requires `pdftotext` in the PATH. For MacOS use `brew cask install pdftotext`.

## Usage

```
$ visa-analyzer ~/Downloads/resumen_cuenta_visa_Mar_2018.pdf \
  -r netflix \
  -r spotify \
  -r shell \
  -r seguros

  Balance anterior: NNNN.nn

  Impuestos: NNNN.nn
  Intereses: NNNN.nn

💰 Total en Pesos: NNNN.nn
💵 Total en Dolares: NNNN.nn

🙅‍ Total de cuotas a pagar este mes: NNNN.nn
🙈 Total de consumos en una cuota en pesos: NNNN.nn
🤦‍ Total de consumos recurrentes en pesos: NNNN.nn
   - netflix:              NNNN.nn
   - spotify:              NNNN.nn
   - shell:                NNNN.nn
   - seguros:              NNNN.nn

💸 Total de consumos en una cuota en usd: NNNN.nn

🙏🏼 Total de cuotas que terminan este mes 🙌🏼: NNNN.nn

🙌🏽 Proyección de cuotas:

- abr. 2018:  NNNN.nn
- may. 2018:  NNNN.nn
- jun. 2018:  NNNN.nn
- jul. 2018:  NNNN.nn
- ago. 2018:  NNNN.nn
- sep. 2018:  NNNN.nn
- oct. 2018:  NNNN.nn
- nov. 2018:  NNNN.nn
- dic. 2018:  NNNN.nn
- ene. 2019:  NNNN.nn
- feb. 2019:  NNNN.nn
- mar. 2019:  NNNN.nn
- abr. 2019:  NNNN.nn
- may. 2019:  NNNN.nn
- jun. 2019:  NNNN.nn
- jul. 2019:  NNNN.nn
- ago. 2019:  NNNN.nn

🙈 Proyección de cuotas + consumos recurrentes:

- abr. 2018:  NNNN.nn
- may. 2018:  NNNN.nn
- jun. 2018:  NNNN.nn
- jul. 2018:  NNNN.nn
- ago. 2018:  NNNN.nn
- sep. 2018:  NNNN.nn
- oct. 2018:  NNNN.nn
- nov. 2018:  NNNN.nn
- dic. 2018:  NNNN.nn
- ene. 2019:  NNNN.nn
- feb. 2019:  NNNN.nn
- mar. 2019:  NNNN.nn
- abr. 2019:  NNNN.nn
- may. 2019:  NNNN.nn
- jun. 2019:  NNNN.nn
- jul. 2019:  NNNN.nn
- ago. 2019:  NNNN.nn
```

## Trademarks

* Visa is a registered trademark of VISA USA.

## License

MIT 2018 - José F. Romaniello