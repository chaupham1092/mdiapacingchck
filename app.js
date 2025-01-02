document.getElementById("pacingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get input values
    const totalBudget = parseFloat(document.getElementById("totalBudget").value);
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    const actualSpend = parseFloat(document.getElementById("actualSpend").value);
    const today = new Date();

    // Validation: Ensure the start date is not after the end date
    if (startDate > endDate) {
        alert("The start date cannot be after the end date. Please check the dates.");
        return;
    }

    // Validation: Ensure the end date is not in the past
    if (endDate < today) {
        alert("The end date cannot be in the past. Please select a valid end date.");
        return;
    }

    // Calculate campaign duration and elapsed days
    const campaignDuration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Total days
    const elapsedDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)); // Days from start to today

    // Validation: Ensure today is within the campaign period
    if (elapsedDays < 0) {
        alert("The campaign has not started yet. Please check the start date.");
        return;
    }

    if (elapsedDays > campaignDuration) {
        alert("The campaign has already ended.");
        return;
    }

    // Calculate metrics
    const plannedSpend = (totalBudget / campaignDuration) * elapsedDays;
    const spendRate = (actualSpend / plannedSpend) * 100;
    const remainingBudget = totalBudget - actualSpend;
    const remainingDays = campaignDuration - elapsedDays;
    const idealDailySpend = remainingBudget / remainingDays;
    const currentDailySpend = actualSpend / elapsedDays;

    // Define a tolerance percentage (10%)
    const tolerance = 0.1; // 10%

    // Check if the current daily spend is within 10% of the ideal daily spend
    let suggestion = "";
    if (Math.abs(currentDailySpend - idealDailySpend) <= idealDailySpend * tolerance) {
        suggestion = "On pace. Keep monitoring and optimizing.";
    } else if (spendRate > 100) {
        suggestion = "Overspending. Reduce bids, pause low-performing campaigns, or optimize targeting.";
    } else if (spendRate < 100) {
        suggestion = "Underspending. Increase bids, expand targeting, or improve creatives.";
    }

    // Set the color for Spend Rate
    let spendRateColor = spendRate > 110 ? "color: red;" : "";

    // Generate output with blue text formatting for Ideal Daily Spend and Current Daily Spend
    const results = `
      <h2>Results</h2>
      <p><strong>Planned Spend:</strong> $${plannedSpend.toFixed(2)}</p>
      <p><strong style="${spendRateColor}">Spend Rate:</strong> <span style="${spendRateColor}">${spendRate.toFixed(2)}%</span></p>
      <p><strong style="color: blue;">Current Daily Spend:</strong> <span style="color: blue;">$${currentDailySpend.toFixed(2)}</span></p>
      <p><strong style="color: blue;">Ideal Daily Spend:</strong> <span style="color: blue;">$${idealDailySpend.toFixed(2)}</span></p>
      <p><strong>Remaining Budget:</strong> $${remainingBudget.toFixed(2)}</p>
      <p><strong>Remaining Days:</strong> ${remainingDays}</p>
      <p><strong>Suggestion:</strong> ${suggestion}</p>
    `;

    document.getElementById("results").innerHTML = results;
});

// Function to format date as "Month Day, Year" (e.g., "January 5, 2025")
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Display today's date in the note section
document.addEventListener("DOMContentLoaded", function() {
    const today = new Date();
    const formattedDate = formatDate(today);
    
    // Insert today's date into the note section
    document.getElementById("todayDate").textContent = formattedDate;
});
