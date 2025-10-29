# QR Contact Generator - Wiki

## Overview
The **QR Contact Generator** converts Excel rows into vCard-formatted QR codes.  
Each contact becomes a `.png` image that can be scanned by any smartphone to instantly save contact info.

---

## Getting Started
- Clone the repository  
- Install dependencies using `npm install`  
- Add your Excel file (`contacts.xlsx`) in the root folder  
- Run `npm start` to generate QR codes

---

## Excel Format Guidelines
Your Excel must include columns for:
- `firstName`, `lastName`
- `organization`
- `title`
- `email`
- `workPhone`
- `website`
- `address`
- `note`

If your column names vary in capitalization (e.g., `FirstName`), the script automatically detects them.

---

## Troubleshooting

| Issue | Possible Cause | Fix |
|--------|----------------|-----|
| “Error reading Excel file” | File missing or corrupted | Ensure file name matches `contacts.xlsx` |
| “No contacts found” | Sheet has no valid rows | Check Excel data |
| “Invalid vCard format” | Missing essential fields | Ensure at least `firstName` or `email` exists |
| Script stops abruptly | Node.js version outdated | Use Node 18+ |

---

## Future Enhancements
- [ ] CLI arguments (custom Excel filename, output path)
- [ ] CSV file support
- [ ] Export summary report (PDF/CSV)
- [ ] Web-based UI using Express.js
- [ ] Integration with Google Contacts

---

## Contributing
1. Fork the repo  
2. Create a new branch:  
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes:  
   ```bash
   git commit -m "Added new feature"
   ```
4. Push the branch:  
   ```bash
   git push origin feature/new-feature
   ```
5. Submit a Pull Request

---

## License

This project is licensed under the **MIT License**.  
See the [LICENSE](../LICENSE) file for details.

---

## Author

Developed by **[Nittin Sharma](https://github.com/nittinsharma37)**  
Feel free to open issues or feature requests in the [GitHub Issues](https://github.com/yourusername/qr-contact-generator/issues) section.
