const ExcelJS = require('exceljs');

module.exports = {
  createWorkbook: () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('First');
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'D.O.B.', key: 'DOB', width: 10 }
    ];
    worksheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
    worksheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});

    return workbook;
  }
};