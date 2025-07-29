# Space Travel Application - User Manual

## Table of Contents

1. [System Overview](#system-overview)
2. [Getting Started](#getting-started)
3. [Data Entry Features](#data-entry-features)
4. [Query Features](#query-features)
5. [Navigation](#navigation)
6. [Troubleshooting](#troubleshooting)

## System Overview

The Space Travel Application is a comprehensive inter-galactic travel management system that allows users to manage space travel infrastructure, including planets, space stations, spaceports, routes, spacecraft, and flights. The system provides both data entry capabilities for managing travel infrastructure and powerful query tools for finding flights and analyzing spaceport traffic.

### Key Features

- **Data Management**: Add and manage planets, space stations, spaceports, routes, spacecraft, and flights
- **Flight Search**: Find available flights between spaceports with advanced filtering options
- **Traffic Analysis**: Analyze spaceport traffic and connections
- **Route Management**: Create and manage travel routes between different locations
- **Real-time Queries**: Search and filter data in real-time

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API server running on `http://localhost:8080`

### Installation and Setup

1. **Navigate to the project directory**:

   ```bash
   cd space-travel-master
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm start
   ```

   For custom port (e.g., 4306):

   ```bash
   $env:PORT=4306; npm start
   ```

4. **Access the application**:
   - Open your web browser
   - Navigate to `http://localhost:3000` (or your custom port)
   - The application will load and display the main dashboard

## Data Entry Features

The application provides comprehensive data entry forms for managing all aspects of space travel infrastructure.

### 1. Planet Entry (`/planet-entry`)

**Purpose**: Add new planets to the system.

**How to Use**:

1. Navigate to "Planet Entry" from the main dashboard
2. Fill in the required fields:
   - **Name**: Enter the planet's name (e.g., "Earth", "Mars")
   - **Size**: Enter the planet's size (numeric value)
   - **Population**: Enter the planet's population (numeric value)
3. Click "Submit" to save the planet
4. View the list of existing planets below the form

**Features**:

- Form validation for required fields
- Success/error message display
- Real-time list of all planets in the system

### 2. Space Station Entry (`/space-station-entry`)

**Purpose**: Add space stations to the system.

**How to Use**:

1. Navigate to "Space Station Entry" from the main dashboard
2. Fill in the required fields:
   - **Name**: Enter the space station's name
   - **In Orbit Of**: Select the planet the station orbits (optional, can be "None")
   - **Owned By Planet**: Select the planet that owns the station (required)
3. Click "Submit" to save the space station
4. View the list of existing space stations

**Features**:

- Dropdown selection for planets
- Optional orbital relationship
- Required ownership relationship
- Success/error message display

### 3. Planet Spaceport Entry (`/planet-spaceport-entry`)

**Purpose**: Add spaceports located on planets.

**How to Use**:

1. Navigate to "Planet Spaceport Entry" from the main dashboard
2. Fill in the required fields:
   - **Name**: Enter the spaceport's name
   - **Planet Name**: Enter the planet name (text input)
   - **Capacity**: Enter the spaceport's capacity (numeric value)
   - **Fee Per Seat**: Enter the fee per seat (numeric value)
3. Click "Submit" to save the spaceport
4. View the list of existing planet spaceports

**Features**:

- Text input for planet name (not dropdown)
- Capacity and fee management
- Duplicate checking for same planet
- Success/error message display

### 4. Station Spaceport Entry (`/station-spaceport-entry`)

**Purpose**: Add spaceports located on space stations.

**How to Use**:

1. Navigate to "Station Spaceport Entry" from the main dashboard
2. Fill in the required fields:
   - **Station Name**: Enter the space station name (text input)
   - **Capacity**: Enter the spaceport's capacity (numeric value)
   - **Fee Per Seat**: Enter the fee per seat (numeric value)
3. Click "Submit" to save the spaceport
4. View the list of existing station spaceports

**Features**:

- Text input for station name (not dropdown)
- Capacity and fee management
- Duplicate checking for same station
- Success/error message display

### 5. Route Entry (`/route-entry`)

**Purpose**: Create travel routes between spaceports.

**How to Use**:

1. Navigate to "Route Entry" from the main dashboard
2. Fill in the required fields:
   - **Origin Spaceport Name**: Enter the departure spaceport name (text input)
   - **Origin Planet**: Select the origin planet from dropdown (optional, can be "None")
   - **Destination Spaceport Name**: Enter the arrival spaceport name (text input)
   - **Destination Planet**: Select the destination planet from dropdown (optional, can be "None")
   - **Distance**: Enter the route distance (numeric value)
3. Click "Submit" to create the route
4. View the list of existing routes

**Features**:

- Text input for spaceport names
- Dropdown selection for planets (optional)
- Duplicate route checking
- Origin and destination validation (cannot be the same)
- Different planets validation (if both planets specified)
- Success/error message display

### 6. Spacecraft Entry (`/spacecraft-entry`)

**Purpose**: Add spacecraft to the system.

**How to Use**:

1. Navigate to "Spacecraft Entry" from the main dashboard
2. Fill in the required fields:
   - **Type Name**: Enter the spacecraft type name (e.g., "Cargo", "Passenger", "Military")
   - **Capacity**: Enter the passenger/cargo capacity (numeric value)
   - **Range**: Enter the maximum travel range (numeric value)
3. Click "Submit" to save the spacecraft
4. View the list of existing spacecraft

**Features**:

- Duplicate type name checking
- Numeric validation for capacity and range
- Success/error message display

### 7. Flight Entry (`/flight-entry`)

**Purpose**: Schedule flights on existing routes.

**How to Use**:

1. Navigate to "Flight Entry" from the main dashboard
2. Fill in the required fields:
   - **Flight Number**: Enter a unique flight identifier
   - **Route**: Select from existing routes in the dropdown
   - **Spacecraft Type**: Select the spacecraft type
   - **Day of Week**: Choose the day of operation
   - **Departure Time**: Enter the departure time (HH:MM:SS format)
   - **Flight Time**: Enter the duration in hours (numeric value)
3. Click "Submit" to schedule the flight
4. View the list of existing flights

**Features**:

- Dropdown selection for routes and spacecraft
- Day of week selection (Monday through Sunday)
- Time format validation
- Flight number uniqueness validation

### 8. Advanced Flight Entry (`/advanced-flight-entry`)

**Purpose**: Create flights with automatic route creation and spacecraft selection.

**How to Use**:

1. Navigate to "Advanced Flight Entry" from the main dashboard
2. **Step 1**: Select origin and destination spaceports
   - Choose origin spaceport from dropdown
   - Choose destination spaceport from dropdown
   - If route doesn't exist, enter distance manually
   - Click "Next"
3. **Step 2**: Select spacecraft
   - Choose from available spacecraft for the route distance
   - Click "Next"
4. **Step 3**: Enter flight details
   - Flight number
   - Day of week
   - Departure time (HH:mm format)
   - Flight duration (hours)
   - Click "Next"
5. **Step 4**: Confirm and submit
   - Review all flight details
   - View total fee calculation
   - Click "Confirm Flight" to create the flight

**Features**:

- 4-step wizard interface
- Automatic route creation if needed
- Intelligent spacecraft filtering based on route distance
- Fee calculation display
- Comprehensive validation at each step
- Confirmation step before submission

## Query Features

The application provides powerful query tools for finding flights and analyzing spaceport data.

### 1. Spaceport Query (`/spaceport-query`)

**Purpose**: Analyze spaceport traffic and connections.

**How to Use**:

1. Navigate to "Spaceport Query" from the main dashboard
2. **Select Spaceport**:
   - Choose a spaceport from the dropdown list
   - The system automatically loads connected spaceports
3. **View Connected Spaceports**:
   - See all spaceports connected to the selected spaceport
   - View connection details and traffic information
4. **Search Flights**:
   - Set date range (start and end dates)
   - Click "Search Flights" to view departures and arrivals
5. **View Results**:
   - **Departures**: List of flights departing from the spaceport
   - **Arrivals**: List of flights arriving at the spaceport
   - Each flight shows: flight number, route, spacecraft, schedule, and timing

**Features**:

- Automatic date range calculation (current week)
- Real-time traffic analysis
- Detailed flight information display
- Connection mapping between spaceports

### 2. Route Query (`/route-query`)

**Purpose**: Find flights on specific routes.

**How to Use**:

1. Navigate to "Route Query" from the main dashboard
2. **Select Route**:
   - Choose a route from the dropdown list
   - Routes are displayed as "Origin Spaceport (Planet) → Destination Spaceport (Planet)"
3. Click "Search" to find flights on the selected route
4. View results showing:
   - Flight numbers
   - Spacecraft types
   - Days of operation
   - Departure times
   - Flight durations

**Features**:

- Dropdown selection of existing routes
- Flight listing for selected route
- Clear flight information display
- "No flights found" message when route has no flights

### 3. Flight Finder (`/flight-finder`)

**Purpose**: Find available flights between spaceports with advanced options.

**How to Use**:

1. Navigate to "Flight Finder" from the main dashboard
2. **Set Search Criteria**:
   - **Origin**: Select departure spaceport
   - **Destination**: Select arrival spaceport
   - **Day of Week**: Choose travel day
   - **Start Time**: Set earliest departure time
   - **Max Stops**: Set maximum number of connections (0 for direct flights)
   - **Max Total Hours**: Set maximum total travel time
3. Click "Search" to find available itineraries
4. View results showing:
   - Flight itineraries with connections
   - Departure and arrival times
   - Total travel duration
   - Number of stops

**Features**:

- Multi-stop flight search
- Time-based filtering
- Duration limits
- Comprehensive itinerary display
- Real-time availability checking

## Navigation

### Main Dashboard

The main dashboard (`/home`) serves as the central hub with links to all features:

**Data Entry Section**:

- Planet Entry
- Space Station Entry
- Planet Spaceport Entry
- Station Spaceport Entry
- Route Entry
- Spacecraft Entry
- Flight Entry
- Advanced Flight Entry

**Queries Section**:

- Spaceport Query
- Route Query
- Flight Finder

### Navigation Tips

- Use the browser's back button to return to previous pages
- All forms include validation and error messages
- Success messages confirm when data is saved
- Lists are automatically updated after successful submissions

## Troubleshooting

### Common Issues

**1. Application Won't Start**

- Ensure you're in the correct directory (`space-travel-master`)
- Check that Node.js and npm are installed
- Run `npm install` to install dependencies
- Verify no other application is using port 3000 (or your custom port)

**2. Backend Connection Errors**

- Ensure the backend API server is running on `http://localhost:8080`
- Check network connectivity
- Verify API endpoints are accessible

**3. Form Submission Errors**

- Check that all required fields are filled
- Verify data formats (numbers for numeric fields, valid times for time fields)
- Ensure unique identifiers (flight numbers, etc.) are not duplicated

**4. No Data Displayed**

- Check if data exists in the system
- Verify backend API is returning data
- Check browser console for JavaScript errors

### Error Messages

**"Failed to fetch [data]"**

- Backend server may be down
- Network connectivity issue
- API endpoint may have changed

**"All fields are required"**

- Fill in all marked required fields
- Check for empty or invalid input

**"Invalid [field] selected"**

- Select a valid option from dropdown lists
- Ensure data exists in the system

**"Error fetching itineraries"**

- Check that origin and destination are different
- Verify spaceports exist in the system
- Ensure routes are available between selected spaceports

### Performance Tips

1. **Large Datasets**: For systems with many records, use filters to narrow searches
2. **Network**: Ensure stable internet connection for API calls
3. **Browser**: Use modern browsers for best performance
4. **Caching**: The application caches some data for better performance

### Support

For technical support or to report issues:

1. Check the browser console for error messages
2. Verify all prerequisites are met
3. Ensure the backend API is running and accessible
4. Check network connectivity and firewall settings

---

**Version**: 1.0  
**Last Updated**: 2024  
**Compatible Browsers**: Chrome, Firefox, Safari, Edge  
**Backend Requirements**: API server on localhost:8080
