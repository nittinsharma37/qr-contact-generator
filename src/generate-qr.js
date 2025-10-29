#!/usr/bin/env node
const vCardsJS = require('vcards-js');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// --- ARGUMENT PARSING ---
const argv = yargs(hideBin(process.argv))
    .option('input', {
        alias: 'i',
        type: 'string',
        description: 'Path to the input Excel file',
        default: path.join(__dirname, '..', 'sample-data', 'contacts.xlsx') // Adjusted default path for CLI usage
    })
    .option('output', {
        alias: 'o',
        type: 'string',
        description: 'Folder where QR codes will be saved',
        default: 'qr-codes'
    })
    .help()
    .version()
    .epilog('For more information, visit https://github.com/nittinsharma37/qr-contact-generator')
    .argv;

// --- CONFIGURATION ---
const EXCEL_FILE = argv.input; 
const OUTPUT_FOLDER = argv.output; 

// --- 1. READ EXCEL FILE ---
function readContactsFromExcel(filePath) {
    try {
        // Read the Excel file
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Use first sheet
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        console.log(`📊 Found ${data.length} contacts in Excel file\n`);
        return data;
    } catch (error) {
        // Provide more detailed feedback on file path
        console.error(`❌ Error reading Excel file at: ${path.resolve(filePath)}`);
        console.error('Error message:', error.message);
        console.log('\n💡 Make sure the Excel file exists and has the correct format, or use the -i option.');
        process.exit(1);
    }
}

// --- 2. CREATE V-CARD STRING ---
function createVCard(contact) {
    const vCard = vCardsJS();
    
    // Set properties (handles undefined/empty values gracefully)
    vCard.firstName = contact.firstName || contact.FirstName || '';
    vCard.lastName = contact.lastName || contact.LastName || '';
    vCard.organization = contact.organization || contact.Organization || '';
    vCard.title = contact.title || contact.Title || contact.designation || '';
    vCard.email = contact.email || contact.Email || '';
    vCard.workPhone = contact.workPhone || contact.WorkPhone || contact.mobile || contact.Mobile || '';
    vCard.url = contact.website || contact.Website || '';
    
    // Address handling
    if (contact.address || contact.Address) {
        vCard.homeAddress.label = 'Work Address';
        vCard.homeAddress.street = contact.address || contact.Address;
    }
    
    vCard.note = contact.note || contact.Note || '';
    
    return vCard.getFormattedString();
}

// --- 3. SANITIZE FILENAME ---
function sanitizeFilename(str) {
    // Remove special characters and replace spaces with hyphens
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// --- 4. GENERATE QR CODE FOR A SINGLE CONTACT ---
async function generateQrCodeForContact(contact, outputFolder) {
    try {
        const vCardString = createVCard(contact);
        
        // Validate vCard string
        if (!vCardString.startsWith('BEGIN:VCARD')) {
            throw new Error('Invalid vCard format');
        }
        
        // Create filename: firstname-lastname-mobile.png
        const firstName = contact.firstName || contact.FirstName || 'unknown';
        const lastName = contact.lastName || contact.LastName || '';
        const mobile = contact.workPhone || contact.WorkPhone || contact.mobile || contact.Mobile || '';
        
        // Sanitize and create filename
        const namePart = sanitizeFilename(`${firstName}-${lastName}`);
        const mobilePart = sanitizeFilename(mobile);
        // Ensure filename is not just an empty string followed by .png
        const filename = `${namePart || 'contact'}-${mobilePart || Date.now()}.png`; 
        const outputPath = path.join(outputFolder, filename);
        
        // Generate QR code
        await QRCode.toFile(outputPath, vCardString, {
            errorCorrectionLevel: 'H',
            type: 'png',
            margin: 4,
            scale: 8
        });
        
        return { success: true, filename, contact: `${firstName} ${lastName}` };
    } catch (error) {
        return { 
            success: false, 
            error: error.message, 
            contact: `${contact.firstName || contact.FirstName || 'Unknown'} ${contact.lastName || contact.LastName || ''}` 
        };
    }
}

// --- 5. MAIN FUNCTION: PROCESS ALL CONTACTS ---
async function generateBulkQrCodes() {
    console.log('🚀 Starting Bulk QR Code Generation...\n');
    console.log(`🗂️ Input File: ${path.resolve(EXCEL_FILE)}`);
    console.log(`📁 Output Folder: ${path.resolve(OUTPUT_FOLDER)}\n`);

    // Create output folder if it doesn't exist
    if (!fs.existsSync(OUTPUT_FOLDER)) {
        fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
        console.log(`📁 Created output folder: ${OUTPUT_FOLDER}\n`);
    }
    
    // Read contacts from Excel
    const contacts = readContactsFromExcel(EXCEL_FILE);
    
    if (contacts.length === 0) {
        console.log('⚠️  No contacts found in Excel file.');
        return;
    }
    
    // Process all contacts
    const results = [];
    let successCount = 0;
    let failCount = 0;
    
    console.log('⏳ Generating QR codes...\n');
    
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const result = await generateQrCodeForContact(contact, OUTPUT_FOLDER);
        results.push(result);
        
        if (result.success) {
            successCount++;
            console.log(`✅ [${i + 1}/${contacts.length}] ${result.contact} → ${result.filename}`);
        } else {
            failCount++;
            console.log(`❌ [${i + 1}/${contacts.length}] ${result.contact} → Error: ${result.error}`);
        }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 GENERATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📁 Output folder: ${path.resolve(OUTPUT_FOLDER)}`);
    console.log('='.repeat(60) + '\n');
}

// --- 6. EXECUTE ---
generateBulkQrCodes().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});

// --- EXCEL FILE FORMAT REFERENCE ---
console.log(`
📋 EXCEL FILE FORMAT REFERENCE:
----------------------------------------
The tool looks for the following column headers (case-insensitive):
- firstName, lastName
- organization
- title (or designation)
- email
- workPhone (or mobile/Mobile)
- website
- address
- note
----------------------------------------
`);