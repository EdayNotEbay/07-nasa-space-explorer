// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// NASA APOD API configuration
const NASA_API_KEY = 'DEMO_KEY'; // Replace with your actual API key for production
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';

// Function to fetch NASA APOD data for a date range
async function fetchNASAData(startDate, endDate) {
    try {
        // Show loading message
        displayLoading();
        
        // Build the API URL with parameters
        const apiUrl = `${NASA_API_URL}?api_key=${NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;
        
        // Fetch data from NASA API
        const response = await fetch(apiUrl);
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        // Display the fetched data
        displayGallery(data);
        
    } catch (error) {
        // Handle any errors that occur during fetching
        console.error('Error fetching NASA data:', error);
        displayError('Failed to load images. Please try again.');
    }
}

// Function to display loading message
function displayLoading() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '<p class="loading">Loading amazing space images...</p>';
}

// Function to display error message
function displayError(message) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = `<p class="error">${message}</p>`;
}

// Function to display the gallery of NASA images
function displayGallery(images) {
    const gallery = document.getElementById('gallery');
    
    // Clear any existing content (including placeholders)
    gallery.innerHTML = '';
    
    // Check if we have images to display
    if (!images || images.length === 0) {
        gallery.innerHTML = '<p>No images found for the selected date range.</p>';
        return;
    }
    
    // Loop through each image and create a card for it
    images.forEach(image => {
        // Only show images, not videos (NASA sometimes returns videos)
        if (image.media_type === 'image') {
            // Create a container for each image
            const imageCard = document.createElement('div');
            imageCard.className = 'image-card';
            
            // Build the HTML content for this image card
            imageCard.innerHTML = `
                <img src="${image.url}" alt="${image.title}" loading="lazy">
                <div class="image-info">
                    <h3>${image.title}</h3>
                    <p class="date">${image.date}</p>
                    <p class="explanation">${image.explanation}</p>
                </div>
            `;
            
            // Add this card to the gallery
            gallery.appendChild(imageCard);
        }
    });
}

// Function to get space images when button is clicked
function getSpaceImages() {
    // Get the dates that the user selected
    const startDate = startInput.value;
    const endDate = endInput.value;
    
    // Make sure both dates are filled in
    if (!startDate || !endDate) {
        displayError('Please select both start and end dates.');
        return;
    }
    
    // Call our function to fetch the NASA data
    fetchNASAData(startDate, endDate);
}

// Find the "Get Space Images" button and add click event
const getImagesButton = document.getElementById('getImages');
if (getImagesButton) {
    getImagesButton.addEventListener('click', getSpaceImages);
}

// Also update gallery when date inputs change (for better user experience)
startInput.addEventListener('change', () => {
    // Only auto-update if both dates are selected
    if (startInput.value && endInput.value) {
        fetchNASAData(startInput.value, endInput.value);
    }
});

endInput.addEventListener('change', () => {
    // Only auto-update if both dates are selected
    if (startInput.value && endInput.value) {
        fetchNASAData(startInput.value, endInput.value);
    }
});

// Load images when the page first loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the date setup to finish, then get initial images
    setTimeout(() => {
        if (startInput.value && endInput.value) {
            fetchNASAData(startInput.value, endInput.value);
        }
    }, 100);
});
