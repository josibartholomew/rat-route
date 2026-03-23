
// Sidebar
function showPiSidebar() {
  const html = HtmlService.createHtmlOutputFromFile("PIEditor")
    .setTitle("PI Data Editor");
  SpreadsheetApp.getUi().showSidebar(html);
}

// Get all data from the sheet
// Returns an array of objects like {pi:"Doe, John", interests:"a, b", college: "college"}
function getAllPIs() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PI Data");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  return data.map(row => ({
    pi: row[0],
    interests: row[1],
    college: row[2]
  }));
}

// Set all data
// Accesses currenlty opened spreadsheet, grabs PI Data and Categories
function savePI(pi, interests, college) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("PI Data");
  const categoriesSheet = ss.getSheetByName("Categories");
  // loads in existing PI data
  const data = sheet.getDataRange().getValues();
  data.shift();

  // Chick if PI exists
  const piIndex = data.findIndex(row => row[0].toLowerCase() === pi.toLowerCase());
  // Update/Insert PI
  if (piIndex >= 0) {
    sheet.getRange(piIndex + 2, 2).setValue(interests);
    sheet.getRange(piIndex + 2, 3).setValue(college);
  } else {
    sheet.appendRow([pi, interests, college]);
  }

  // Extract interest list from the input
  const interestList = interests
    .split(",")
    .map(i => i.trim())
    .filter(i => i.length > 0);

  // Get existing interests in the Categories sheet
  const existingInterests = categoriesSheet
    .getRange("A2:A" + categoriesSheet.getLastRow())
    .getValues()
    .flat()
    .map(c => c.toLowerCase());
  // Find new interests that haven't been categorized yet
  const newInterests = interestList.filter(
    i => !existingInterests.includes(i.toLowerCase())
  );

  // Return results (if there's uncategorized interests, HTML UI prompts user to classify them)
  if (newInterests.length > 0) {
    // Return list to front end for classification
    return { message: "newInterestsFound", newInterests: newInterests };
  } else {
    return { message: "Saved PI: " + pi };
  }
}

// Gets the categories list
function getCategoriesList() {
  const categoriesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Categories");
  const categories = categoriesSheet
    .getRange("B2:B" + categoriesSheet.getLastRow())
    .getValues()
    .flat()
    .filter(c => c.length > 0);
  return [...new Set(categories)];
}

// Save the newly classified interests
function saveNewInterests(interestCategoryPairs) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Categories");
  const lastRow = sheet.getLastRow();
  const rows = interestCategoryPairs.map(([interest, category]) => [interest, category]);
  sheet.getRange(lastRow + 1, 1, rows.length, 2).setValues(rows);
  return "New interests added and categorized!";
}
// Search PIs by category
function searchPIsByCategory(category) {
  // Load mapping: interest -> category
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const piSheet = ss.getSheetByName("PI Data");
  const categoriesSheet = ss.getSheetByName("Categories");

  if (!category) return [];

  // Get interest → category mapping
  const catData = categoriesSheet
    .getRange("A2:B" + categoriesSheet.getLastRow())
    .getValues()
    .filter(r => r[0] && r[1]);
  // Find all interests belonging to a selected category
  const interestsForCategory = catData
    .filter(r => r[1].toLowerCase() === category.toLowerCase())
    .map(r => r[0].toLowerCase());

  if (interestsForCategory.length === 0) return [];

  // Get PIs
  const piData = piSheet.getDataRange().getValues();
  const headers = piData.shift();
  // Load PIs and find matches
  const matchingPIs = piData.filter(row => {
    const interests = (row[1] || "").toLowerCase();
    return interestsForCategory.some(interest =>
      interests.includes(interest)
    );
  });
  // return PI objects
  return matchingPIs.map(row => ({
    pi: row[0],
    interests: row[1],
    college: row[2],
  }));
}
// Web Entry Point [could be moved to top for readability?]
function doGet() {
  return HtmlService.createHtmlOutputFromFile("PIEditor")
      .setTitle("Rat Route")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
// Search PIs by keyword (interest)
function searchPIsByInterest(keyword) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PI Data");
  const data = sheet.getDataRange().getValues();
  data.shift(); // remove headers

  // Convert the keyword to lowercase and escape regex special characters
  const escapedKeyword = keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escapedKeyword}\\b`, "i");

  // Search each PI row
  const results = data.filter(row => {
    const interests = (row[1] || "").toLowerCase();
    return regex.test(interests);
  });

  if (results.length === 0) {
    return [{ pi: `No PIs found for: ${keyword}`, interests: "-", college: "-" }];
  }

  return results.map(row => ({
    pi: row[0],
    interests: row[1],
    college: row[2]
  }));
}
