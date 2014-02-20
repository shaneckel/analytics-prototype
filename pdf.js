
//mci.js / pdf

var PDFDocument = require('pdfkit'),
    fs          = require('fs');
  
module.exports = {
  create : function(res, req){
    var doc     = new PDFDocument({size: 'LETTER',layout: 'portrait'})
      , pdfY       = 20
      , objLen  = req.body.length

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
 
    //res.end(doc.write('public/temp/out.pdf'));
    //res.end();
    
    doc.output(function(string) {
      console.log(string);
      res.end(string);
    });
  },
  
  remove : function(filename){
    var file = __dirname + '/public/temp/' + filename;
    fs.unlinkSync(file)
    console.log('successfully deleted ' + file);
  }
}
