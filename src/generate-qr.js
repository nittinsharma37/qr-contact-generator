const vCardsJS = require('vcards-js');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

// --- CONFIGURATION ---
const EXCEL_FILE = 'sample-data/contacts.xlsx'; // Your Excel file name
const OUTPUT_FOLDER = 'qr-codes'; // Folder where QR codes will be saved

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
        console.error('❌ Error reading Excel file:', error.message);
        console.log('\n💡 Make sure the Excel file exists and has the correct format.');
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
        const filename = `${namePart}-${mobilePart}.png`;
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
    console.log(`📁 Output folder: ${path.join(__dirname, OUTPUT_FOLDER)}`);
    console.log('='.repeat(60) + '\n');
}

// --- 6. EXECUTE ---
generateBulkQrCodes().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});

// --- EXCEL FILE FORMAT REFERENCE ---
console.log(`
📋 EXCEL FILE FORMAT (${EXCEL_FILE}):
----------------------------------------
Column headers (case-insensitive):
- firstName (or FirstName)
- lastName (or LastName)
- organization (or Organization)
- title (or Title/designation)
- email (or Email)
- workPhone (or WorkPhone/mobile/Mobile)
- website (or Website)
- address (or Address)
- note (or Note)

Example:
| firstName | lastName | organization | title | email | workPhone | website | address | note |
|-----------|----------|--------------|-------|-------|-----------|---------|---------|------|
| Nittin    | Sharma   | Tech Corp    | Dev   | n@..  | +91-98... | http..  | 123 St  | ...  |
----------------------------------------
`);