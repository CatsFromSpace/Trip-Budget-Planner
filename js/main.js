// Cali Crouse - CSCI211 - Task 1 - main.js

// Add trip to local storage - Originally I wanted to use an array to store info, but it was hard to get it to persist between reloads so I learned about global storage.
function addTripToLocalStorage(destination, days, totalBudget) {
    const trips = JSON.parse(localStorage.getItem('trips')) || []; // if trips is not yet defined, set to empty array
    
    trips.push({ destination, days, totalBudget });
    
    localStorage.setItem('trips', JSON.stringify(trips));
}

// Calculate the total budget
function calculateBudget(days, dailyExpense, travelCost) {
    return (days * dailyExpense) + travelCost;
}

// Load saved trips from local storage
function loadTripsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('trips')) || [];
}

// Function to remove a trip from local storage
function removeTripFromLocalStorage(index) {
    const trips = loadTripsFromLocalStorage();
    
    trips.splice(index, 1); // Remove the trip at the specified index
    
    localStorage.setItem('trips', JSON.stringify(trips)); // Update local storage
}

// Collect form data and calculate budget ONLY when html has fully loaded, thus the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    const budgetForm = document.getElementById('budgetForm');
    
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) { // This is called when you click the "calculate" button
            e.preventDefault();

            const destination = document.getElementById('destination').value;
            const days = parseInt(document.getElementById('days').value);
            const dailyExpense = parseFloat(document.getElementById('dailyExpense').value);
            const travelCost = parseFloat(document.getElementById('travelCost').value);

            const totalBudget = calculateBudget(days, dailyExpense, travelCost);
            
            document.getElementById('totalBudget').textContent = totalBudget.toFixed(2); // Rounded
        });

        // Add trip to local storage when "Save Trip" button is clicked
        document.getElementById('saveTrip').addEventListener('click', function() {
            const destination = document.getElementById('destination').value;
            const days = parseInt(document.getElementById('days').value);
            const totalBudget = parseFloat(document.getElementById('totalBudget').textContent);

            if (destination && days && !isNaN(totalBudget)) { // making sure user can't submit empty or wrong form
                addTripToLocalStorage(destination, days, totalBudget);
                alert('Trip saved successfully!');
            } else {
                alert('Please calculate the budget first.');
            }
        });
    }

    // Display saved trips on history page
    if (document.getElementById('tripList')) {
        const trips = loadTripsFromLocalStorage();
        const tripList = document.getElementById('tripList');
        tripList.innerHTML = ''; // Clear previous trips

        if (trips.length === 0) {
            tripList.innerHTML = '<li>No trips saved yet.</li>';
            return;
        }

        trips.forEach(function(trip, index) {
            const li = document.createElement('li');
            li.textContent = `Destination: ${trip.destination}, Days: ${trip.days}, Total Budget: $${trip.totalBudget}`;
            
            // Create remove button for list items
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
           
            removeButton.addEventListener('click', function() {
                removeTripFromLocalStorage(index);
                li.remove(); 
            });

            li.appendChild(removeButton);
            tripList.appendChild(li);
        });
    }
});
