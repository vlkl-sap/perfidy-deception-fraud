const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

async function createPDF() {

    const filename = "perfidy-deception-fraud.pdf";

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);

    const form = pdfDoc.getForm();
    const textField = form.createTextField('field1');

    textField.setText(`
"Perfidy, Deception, Fraud (PDF)"
For information about this project, see
https://github.com/vlkl-sap/perfidy-deception-fraud

Error: Your PDF viewer does not support forms and/or JavaScript.

In a social engineering attack, this text could read:

This document is encrypted for your security. 
Please use a supported reader and enable JavaScript to view it.
`);
    textField.addToPage(page, { x: 0, y: 0, 
                                width: 595, height: 842, 
                                borderWidth: 0, 
                                borderColor: rgb(1, 1, 1) });

    textField.enableReadOnly();
    textField.setFontSize(12);
    textField.setAlignment(1); //center
    textField.enableMultiline();

    pdfDoc.addJavaScript(
        "generateText",
        `
        var f = this.getField("field1");
        try {

            var loc = this.baseURL || this.path || this.URL;
            var rx = /\\/(?:home|Users)\\/([^\\/]*)\\//g;
            var m = rx.exec(loc) || ["",""];

            // Acrobat does not currently support template strings :(
            f.value =
'\\n\\n\\nPDFs are immutable, right?' +
'\\nReload this document.' +

'\\n\\nWhen this PDF is loaded, a JavaScript program embedded in the document' +
'\\ngenerates the content you are seeing.' +

'\\n\\nThis document changes its displayed content with time (while the file stays the same)' +
'\\nand displays different content to different people. ' +
'\\nIn principle, far-reaching content changes based on the data below are possible.' +

'\\n\\n\\nYour payment is due on: ' + util.printd("dddd, yyyy-mm-dd HH:MM:ss", new Date()) +

'\\n\\n\\nThings I know about you:' +

'\\n\\nUsername (guess): ' + m[1] +
'\\nTimezone offset: ' + new Date().getTimezoneOffset() +
'\\nLanguage: ' + app.language +
'\\nMonitors: ' +app.monitors +
'\\nPrinters: ' +app.printerNames +
'\\nFile location: ' +loc +

'\\n\\n\\n"Perfidy, Deception, Fraud (PDF)"' +
'\\nFor information about this project, see' +
'\\nhttps://github.com/vlkl-sap/perfidy-deception-fraud'
                ;

        } catch (error) {
          f.value = ''+error;
        }
        `
    );

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filename, pdfBytes);

    console.log("PDF generated: " + filename);
}

createPDF();

