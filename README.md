# QR Contact Generator

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

---

## Troubleshooting

| Issue | Possible Cause | Fix |
|-------|----------------|-----|
| "Error reading Excel file" | File missing or path is wrong | Use the `-i` option with the correct absolute or relative path to your file. |
| "No contacts found" | Sheet has no valid rows | Check Excel data. |
| "Invalid vCard format" | Missing essential fields | Ensure at least `firstName` or `email` exists for each row. |

---

## Future Enhancements

* [ ] CSV file support
* [ ] Export summary report (PDF/CSV)
* [ ] Web-based UI using Express.js
* [ ] Integration with Google Contacts

---

## Contributing

1. Fork the repo
2. Create a new branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m "Added new feature"`
4. Push the branch: `git push origin feature/new-feature`
5. Submit a Pull Request

---

## License

This project is licensed under the MIT License.  
See the LICENSE file for details.

---

## Author

<p>
  Developed with ❤️ by 
  <strong>
    <a href="https://github.com/nittinsharma37" target="_blank" style="text-decoration: none;">
      Nittin Sharma
    </a>
  </strong>
</p>


Feel free to open issues or feature requests in the [Issues](https://github.com/yourusername/qr-contact-generator/issues) section.