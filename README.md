This is something I personally use to analyze PdF resumes from from www.visa.com.ar

## Installation

```
npm i -g jfromaniello/visa-analyzer
```
**Note:** this program requires `pdftotext` in the PATH. For MacOS use `brew cask install pdftotext`.

## Usage

```
$ visa-analyzer ~/Downloads/resumen_cuenta_visa_Mar_2018.pdf

💰Total en Pesos: XXXXXXX
💵Total en Dolares: XX

🤦🏽Total de consumos en una cuota en pesos: XXXXX
🤦🏽Total de consumos en una cuota en usd: XXX
🤮 Total de las cuotas a pagar este mes: XXX

🙏🏼Total de las cuotas que terminan este mes y no vendran el próximo 🙌🏼: XXXX

🙌🏽Proyección de cuotas:

- may. 2018:  xyyyyyy
- jun. 2018:  xyyyyyy
- jul. 2018:  xyyyyyy
- ago. 2018:  xyyyyyy
- sep. 2018:  xyyyyyy
- oct. 2018:  xyyyyyy
- nov. 2018:   xyyyyy
```

## Trademarks

* Visa is a registered trademark of VISA USA.

## License

MIT 2018 - José F. Romaniello