const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const {upload} = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const parser = require('xml2json');
const ticketService = require('../services/ticketService');
const TicketModel = require('../models/ticket');

router.use(verifyJwtToken);

function deleteFileFromFileSystem(path) {
    fs.unlinkSync(path);
}

function getProductsFromJob(jobAsJson) {
    return jobAsJson['TicketItem'];
}

router.get('/test', async (request, response) => {
    const testObject = 
    {
        'TicketItem': [
            {
                'TicketNumber': '696969',
                'CustPONum': 'Shawn',
                'OrderDate': '2022-04-22',
                'Ship_by_Date': '2022-05-02',
                'Priority': 'Standard',
                'Notes': [
                    'bkag',
                    'oisfjhap'
                ],
                'ProductNumber': '767D-5253',
                'Description': 'KARLACTI,  INC - MAYAR - ACKAWI SEMISOFT CHEESE - UPC: 73310',
                'OrderQuantity': '1000',
                'PriceM': '90.4',
                'PriceMode': 'Per M',
                'LabelsPer_': '500',
                'MachineCount': '28',
                'EstFootage': '597',
                'SizeAcross': '3',
                'NoColors': '5',
                'Hidden_Notes': 'CMYK-W',
                'FinalUnwind': 'Out/Left 4',
                'SizeAround': '3',
                'NoAcross': '3',
                'ColSpace': '0.125',
                'NoAround': '12',
                'RowSpace': '0.125',
                'CornerRadius': '0',
                'FinishType': 'Rolls',
                'StockNum': '410D LAM',
                'StockNum2': '9135',
                'StockNum3': {},
                'ToolNo1': 'DC-025',
                'ToolNo2': {},
                'InkType': {},
                'StockNotes': {},
                'FinishNotes': {},
                'ShipAttn_EmailAddress': {},
                'ShipVia': 'Ups-G Use Customer#',
                'ShippingInstruc': {},
                'ShipLocation': 'KARLACTI, INC.',
                'ShipAddr1': '4012 Middle Ridge Dr.',
                'ShipAddr2': 'Tel #(703) 647-9589',
                'ShipCity': 'Fairfax',
                'ShipSt': 'VA',
                'ShipZip': '22033-3212',
                'BillLocation': 'Label Resource And Graphics',
                'BillAddr1': '5075 Fox Knoll Lane',
                'BillAddr2': {},
                'BillCity': 'Colgate',
                'BillState': 'WI',
                'BillZip': '53017'
            },
            {
                'TicketNumber': '696969',
                'CustPONum': 'Shawn',
                'OrderDate': '2022-04-22',
                'Ship_by_Date': '2022-05-02',
                'Priority': 'Standard',
                'Notes': [
                    {},
                    {}
                ],
                'ProductNumber': '767D-5251',
                'Description': 'KARLACTI,  INC - MAYAR - NABULSI SEMISOFT CHEESE - UPC: 73410',
                'OrderQuantity': '1500',
                'PriceM': '90.4',
                'PriceMode': 'Per M',
                'LabelsPer_': '500',
                'MachineCount': '42',
                'EstFootage': '597',
                'SizeAcross': '3',
                'NoColors': '5',
                'Hidden_Notes': 'CMYK-W-OV\nExp - .05',
                'FinalUnwind': 'Out/Left 4',
                'SizeAround': '3',
                'NoAcross': '3',
                'ColSpace': '0.125',
                'NoAround': '12',
                'RowSpace': '0.125',
                'CornerRadius': '0',
                'FinishType': 'Rolls',
                'StockNum': '410D LAM',
                'StockNum2': '9135',
                'StockNum3': {},
                'ToolNo1': 'DC-025',
                'ToolNo2': {},
                'InkType': {},
                'StockNotes': {},
                'FinishNotes': {},
                'ShipAttn_EmailAddress': {},
                'ShipVia': 'Ups-G Use Customer#',
                'ShippingInstruc': {},
                'ShipLocation': 'KARLACTI, INC.',
                'ShipAddr1': '4012 Middle Ridge Dr.',
                'ShipAddr2': 'Tel #(703) 647-9589',
                'ShipCity': 'Fairfax',
                'ShipSt': 'VA',
                'ShipZip': '22033-3212',
                'BillLocation': 'Label Resource And Graphics',
                'BillAddr1': '5075 Fox Knoll Lane',
                'BillAddr2': {},
                'BillCity': 'Colgate',
                'BillState': 'WI',
                'BillZip': '53017'
            },
            {
                'TicketNumber': '696969',
                'CustPONum': 'Shawn',
                'OrderDate': '2022-04-22',
                'Ship_by_Date': '2022-05-02',
                'Priority': 'Standard',
                'Notes': [
                    {},
                    {}
                ],
                'ProductNumber': '767D-5609',
                'Description': 'KARLACTI,  INC - MAYAR - SYRIAN SEMISOFT CHEESE - UPC: 73510',
                'OrderQuantity': '1500',
                'PriceM': '90.4',
                'PriceMode': 'Per M',
                'LabelsPer_': '500',
                'MachineCount': '42',
                'EstFootage': '597',
                'SizeAcross': '3',
                'NoColors': '5',
                'Hidden_Notes': 'CMYK-W',
                'FinalUnwind': 'Out/Left 4',
                'SizeAround': '3',
                'NoAcross': '3',
                'ColSpace': '0.125',
                'NoAround': '12',
                'RowSpace': '0.125',
                'CornerRadius': '0',
                'FinishType': 'Rolls',
                'StockNum': '410D LAM',
                'StockNum2': '9135',
                'StockNum3': {},
                'ToolNo1': 'DC-025',
                'ToolNo2': {},
                'InkType': {},
                'StockNotes': {},
                'FinishNotes': {},
                'ShipAttn_EmailAddress': {},
                'ShipVia': 'Ups-G Use Customer#',
                'ShippingInstruc': {},
                'ShipLocation': 'KARLACTI, INC.',
                'ShipAddr1': '4012 Middle Ridge Dr.',
                'ShipAddr2': 'Tel #(703) 647-9589',
                'ShipCity': 'Fairfax',
                'ShipSt': 'VA',
                'ShipZip': '22033-3212',
                'BillLocation': 'Label Resource And Graphics',
                'BillAddr1': '5075 Fox Knoll Lane',
                'BillAddr2': {},
                'BillCity': 'Colgate',
                'BillState': 'WI',
                'BillZip': '53017'
            },
            {
                'TicketNumber': '696969',
                'CustPONum': 'Shawn',
                'OrderDate': '2022-04-22',
                'Ship_by_Date': '2022-05-02',
                'Priority': 'Standard',
                'Notes': [
                    {},
                    {}
                ],
                'ProductNumber': '767D-5610',
                'Description': 'KARLACTI,  INC - MAYAR - TOUMA VILLAGE CHEESE  - SEMISOFT - UPC: 73520',
                'OrderQuantity': '1000',
                'PriceM': '90.4',
                'PriceMode': 'Per M',
                'LabelsPer_': '500',
                'MachineCount': '28',
                'EstFootage': '597',
                'SizeAcross': '3',
                'NoColors': '5',
                'Hidden_Notes': 'CMYK-W-OV',
                'FinalUnwind': 'Out/Left 4',
                'SizeAround': '3',
                'NoAcross': '3',
                'ColSpace': '0.125',
                'NoAround': '12',
                'RowSpace': '0.125',
                'CornerRadius': '0',
                'FinishType': 'Rolls',
                'StockNum': '410D LAM',
                'StockNum2': '9135',
                'StockNum3': {},
                'ToolNo1': 'DC-025',
                'ToolNo2': {},
                'InkType': {},
                'StockNotes': {},
                'FinishNotes': {},
                'ShipAttn_EmailAddress': {},
                'ShipVia': 'Ups-G Use Customer#',
                'ShippingInstruc': {},
                'ShipLocation': 'KARLACTI, INC.',
                'ShipAddr1': '4012 Middle Ridge Dr.',
                'ShipAddr2': 'Tel #(703) 647-9589',
                'ShipCity': 'Fairfax',
                'ShipSt': 'VA',
                'ShipZip': '22033-3212',
                'BillLocation': 'Label Resource And Graphics',
                'BillAddr1': '5075 Fox Knoll Lane',
                'BillAddr2': {},
                'BillCity': 'Colgate',
                'BillState': 'WI',
                'BillZip': '53017'
            }
        ]
    };

    ticketService.removeEmptyObjectAttributes(testObject);

    const ticketAttributes = ticketService.convertRawJsonIntoTicketObject(testObject);

    try {
        await TicketModel.create(ticketAttributes);
        return response.send('yay, success!!')
    } catch (error) {
        return response.send(`error: ${error}`);
    }

    // response.send(JSON.stringify(testObject));
});

router.get('/upload', (request, response) => {
    response.render('uploadTicket');
});

router.post('/upload', upload.single('job-xml'), (request, response) => {
    const jobFilePath = path.join(path.resolve(__dirname, '../../') + '/uploads/' + request.file.filename);

    try {
        const jobAsXml = fs.readFileSync(jobFilePath);
        const jobAsJson = JSON.parse(parser.toJson(jobAsXml))['Root'];
        const ticket = new TicketModel(jobAsJson);

        return response.send(jobAsJson);

        const productsFromJob = getProductsFromJob(jobAsJson);

        response.json(productsFromJob);
    } catch (error) {
        console.log(`Error uploading job file: ${JSON.stringify(error)}`);
        request.flash('errors', ['The following error occurred while uploading the file:', error.message]);
    
        return response.redirect('/tickets/upload');
    } finally {
        deleteFileFromFileSystem(jobFilePath);
    }    
});

module.exports = router;