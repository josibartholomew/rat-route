# Rat Route
A Google Sheets + Apps Script tool for managing Principal Investigator (PI) data and their research interests. This project provides a searchable database of PIs, allows categorization of interests, and supports a simple web sidebar interface.
## Features
- View and edit PI data via a sidebar in Google Sheets.
- Search PIs by keyword (interest) or by category.
- Automatically detect new interests that aren’t yet categorized.
- Add and categorize new interests directly in the sheet.
- Supports multiple categories and mapping of interests → categories.
- Lightweight HTML sidebar interface with Apps Script backend.
## Spreadsheet Structure
Spreadsheet Structure
1. PI Data (Sheet Name: PI Data)
Column	Description
A	PI Name (Doe, John)
B	Interests (a, b, c)
C	College / Affiliation
2. Categories (Sheet Name: Categories)
Column	Description
A	Interest (Machine Learning, Neuroscience)
B	Category (AI, Biology)
## Usage
1. Open the Google Sheet and click the custom menu to launch the PI Editor sidebar.
2. View and edit PIs: Add new PIs or update interests and colleges.
3. Categorize new interests: If a PI has a new interest, the system will prompt you to assign it a category.
4. Search:
By keyword: Find PIs with a specific research interest.
By category: Find all PIs in a broader category of interest.
## Notes
- Interest searches are case-insensitive and treat each interest as a whole word.
- New interests are automatically detected when adding or updating PIs.
- The HTML is fully customizable if you want to change the interface. It is currently customized with Southern Utah University's colors and logo.
- Ensure the sheet names PI Data and Categories remain exactly as expected for the scripts to work.
