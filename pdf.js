
//mci.js / pdf

var PDFDocument = require('pdfkit');
  
module.exports = {
  create : function(res, req){
    var doc     = new PDFDocument({size: 'LETTER',layout: 'portrait'})
      , pdfY    = 20
      , objLen  = req.body.length;

    doc.image('public/img/logo.png', 500, 700)
    doc.fontSize(8)
    for (var i=0;i<objLen;i++) {
      doc.text(req.body[i].clientID + ' - ' + req.body[i].clientName, 20, pdfY);
      pdfY += 12;

      if (pdfY > 700) {
        doc.addPage();
        doc.image('public/img/logo.png', 500, 700)
        pdfY = 20;
      }
    }
    
    doc.output(function(string) {
      res.end(string);
    });
  }
}
