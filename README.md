# QR Contact Generator

[![npm version](https://badge.fury.io/js/qr-contact-generator.svg)](https://badge.fury.io/js/qr-contact-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview
The **QR Contact Generator** is a Node.js CLI tool that converts rows from an Excel file into vCard-formatted QR codes.  
Each contact generates a high-resolution `.png` image that can be scanned by any smartphone to instantly save contact information.

---

## Getting Started

### Installation
Install the tool globally using npm:
```bash
npm install -g qr-contact-generator
```

### Usage

Run the command directly from your terminal, optionally specifying your input and output paths:
```bash
qr-contact-generator [options]
```

**Example:** If your contact list is named `client-contacts.xlsx` and you want the QRs saved in a folder named `qrs-for-print`:
```bash
qr-contact-generator --input ./client-contacts.xlsx --output ./qrs-for-print
```

**Using default settings:**
```bash
qr-contact-generator
```

This will look for `sample-data/contacts.xlsx` and save QR codes to the `qr-codes` folder.

### Options

| Option | Alias | Description | Default Value |
|--------|-------|-------------|---------------|
| `--input` | `-i` | Path to the input Excel file. | `sample-data/contacts.xlsx` |
| `--output` | `-o` | Folder where QR codes will be saved. | `qr-codes` |
| `--help` | `-h` | Show help information. | |
| `--version` | `-v` | Show version number. | |

---

## Excel Format Guidelines

Your Excel spreadsheet must include a header row. The tool is case-insensitive and can detect variations.

### Key Column Headers:
* `firstName`, `lastName`
* `organization`
* `title` (or `designation`)
* `email`
* `workPhone` (or `mobile`)
* `website`
* `address`
* `note`

### Sample Excel Structure:

| firstName | lastName | organization | title | email | workPhone | website | address | note |
|-----------|----------|--------------|-------|-------|-----------|---------|---------|------|
| John | Doe | Acme Corp | CEO | john@acme.com | +1234567890 | acme.com | 123 Main St | VIP Client |
| Jane | Smith | Tech Inc | CTO | jane@tech.com | +0987654321 | tech.com | 456 Oak Ave | Partner |

---

## Features

- ✅ Bulk QR code generation from Excel files
- ✅ High-resolution PNG output (error correction level: H)
- ✅ Case-insensitive column name detection
- ✅ Automatic filename sanitization
- ✅ Progress tracking with success/failure counts
- ✅ vCard 3.0 compatible format
- ✅ Works with any smartphone camera app

---

## Use Cases

- **Business networking events** - Generate QR codes for all attendees
- **Conference badges** - Print QR codes on name tags
- **Marketing materials** - Add contact QR codes to brochures
- **Team directories** - Create scannable contact cards
- **Client databases** - Quickly share contact information

---

## Troubleshooting

| Issue | Possible Cause | Fix |
|-------|----------------|-----|
| "Error reading Excel file" | File missing or path is wrong | Use the `-i` option with the correct absolute or relative path to your file. |
| "No contacts found" | Sheet has no valid rows | Check Excel data and ensure headers are present. |
| "Invalid vCard format" | Missing essential fields | Ensure at least `firstName` or `email` exists for each row. |
| Command not found | Package not installed globally | Run `npm install -g qr-contact-generator` |

---

## Future Enhancements

* [ ] CSV file support
* [ ] Export summary report (PDF/CSV)
* [ ] Web-based UI using Express.js
* [ ] Integration with Google Contacts
* [ ] Batch processing with multiple Excel files
* [ ] Custom QR code styling (colors, logos)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repo
2. Create a new branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m "Added new feature"`
4. Push the branch: `git push origin feature/new-feature`
5. Submit a Pull Request

---

## License

This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for details.

---

## Issues & Support

Found a bug or have a feature request? Please open an issue on [GitHub Issues](https://github.com/nittinsharma37/qr-contact-generator/issues).

---

## Show Your Support

If you find this project helpful, please give it a ⭐ on [GitHub](https://github.com/nittinsharma37/qr-contact-generator)!

---

<p align="center">Developed with ❤️ by <strong><a href="https://github.com/nittinsharma37">Nittin Sharma</a></strong></p>


```
MIT License

Copyright (c) 2025 Nittin Sharma

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.