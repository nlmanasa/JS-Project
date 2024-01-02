# JS-Project

## Overview
The provided project is a Movie App implemented using HTML, JavaScript, and CSS. The app leverages The Movie Database (TMDb) API to fetch movie data dynamically. Users can interact with the app through a user-friendly web interface to select their favorite movie language, filter movies by decade and genres, search for movies by title or cast.

## Configure Project
- On a command prompt, clone the repository using command `git clone https://github.com/nlmanasa/JS-Project.git` in a directory of your choice. It will create directory `JS-Project` with the contents of this repository. 
- In VS Code, use `File > Open Folder` (Windows) or `File > Open` (Mac) to open the `JS-Project` folder.

## Running the Project
- Execute command `npm start` on terminal window. This will start the `lite-server` on port 3000 and open a new tab on your default browser to show the project home - index.html. 

  
## Usage
#### Follow the below instruction to select your favorite movie language, filter by decade and genres, and search for movies.

#### Select Your Favorite Movie Language
- Choose your preferred language by clicking on the corresponding radio button.
- The selection is dynamic and will update the available movies based on your chosen language.

#### Filter Movies by Decade
- Below the language selection, Choose a decade from the available options. The decades are populated dynamically based on the movies in the database.
- The movie list will be updated to include only those from the selected decade.
  
#### Search Movies by Name or Cast Member
- In the "Search Movies By Name or Cast Member" section, enter the name of a movie or a cast member in the provided text input and click  the "Search" button.
- The displayed movies will be filtered to match your search query.

#### Select Genres and Apply Logic Conditions:
- In the "Select Genres" section, you'll find a list of checkboxes representing different movie genres.
Check the genres you're interested in. The movie list will update dynamically based on your genre selections.
- Choose the logic condition (either "OR" or "AND") by selecting the corresponding radio button. "OR" condition displays movies that match any of the selected genres. "AND" condition displays movies that match all selected genres simultaneously.
- Click the "Submit" button to apply the genre filters based on your selections.
- The movie list will be further refined based on the chosen genres and logic conditions.

#### Final Result 
- The final filtered and searched movie results will be displayed in the "content" section as a series of cards.
Each card contains information about a specific movie, including its title, release date, tagline, and an image.








