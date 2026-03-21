# Calendar To-Do - Next.js, React, TypeScript, TailwindCSS, Framer Motion Fundamental Project 12

A modern, responsive, and interactive web application built using **React** and **Vite**. It combines the power of a calendar with a to-do/events organizer, allowing users to select any day of the month, set reminders for specific times, and manage events (add/edit/delete) with an intuitive and visually appealing interface. The project is designed for both learning and practical usage—ideal for anyone interested in React, Vite, and modern front-end development.

- **Live Demo:** [https://taskmate-calendar.vercel.app/](https://taskmate-calendar.vercel.app/)

---

## Table of Contents

1. [Project Summary](#project-summary)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Technology Stack](#technology-stack)
5. [Installation & Setup](#installation--setup)
6. [How to Use](#how-to-use)
7. [Application Walkthrough](#application-walkthrough)
8. [Component Overview](#component-overview)
9. [Styling & Responsiveness](#styling--responsiveness)
10. [Code Examples](#code-examples)
11. [Learning Points & Keywords](#learning-points--keywords)
12. [Conclusion](#conclusion)

---

## Features

- **Monthly Calendar View**: Navigate through months and years with ease.
- **Event/To-Do Management**: Add, edit, and delete events for any date.
- **Set Event Times**: Specify hours and minutes for each event.
- **Live Event List**: View all events in a scrollable list.
- **Intuitive UI**: Modern, clean, and responsive user interface.
- **Persistent State**: (Option for future) Easily extendable for local storage or backend integration.
- **Mobile Friendly**: Adaptive layout for various screen sizes.

---

## Project Structure

```plaintext
Calendar-To-Do--ReactVite/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx
│   └── Components/
│       ├── CalendarApp.jsx
│       └── CalendarApp.css
└── README.md
```

- **index.html**: Entry HTML file, loads the React app.
- **vite.config.js**: Vite configuration using React plugin.
- **src/App.jsx**: Root component, renders the main calendar app.
- **src/Components/CalendarApp.jsx**: Core logic and UI for the calendar and event system.
- **src/Components/CalendarApp.css**: All styling for the calendar app.

---

## Technology Stack

- **React**: Declarative, component-based UI library.
- **Vite**: Lightning-fast development server and build tool.
- **JavaScript (ES6+)**: Application language.
- **CSS3**: Custom styling for modern and responsive design.
- **Boxicons**: Icon library for navigation and actions.

---

## Installation & Setup

**1. Install Node.js**  
Make sure you have [Node.js](https://nodejs.org/en/) installed on your machine.

**2. Clone the Repository**

```bash
git clone https://github.com/arnobt78/Calendar-To-Do--ReactVite.git
cd Calendar-To-Do--ReactVite
```

**3. Install Dependencies**

```bash
npm install
```

**4. Run the Development Server**

```bash
npm run dev
```

**5. Open in Browser**  
Navigate to [http://localhost:5173/](http://localhost:5173/) to view your app.

---

## How to Use

1. **Navigate Months**: Use the left/right arrow icons to move between months.
2. **Select a Day**: Click on any day to open the event popup.
3. **Add Event**: Set the event time and description (max 60 characters) and click "Add Event".
4. **Edit Event**: Click the pencil/edit icon next to any event to modify it.
5. **Delete Event**: Click the trash/delete icon to remove an event.
6. **View Events**: All events are listed beside the calendar for quick review.

---

## Application Walkthrough

- **Calendar Display**: Shows current month and year, highlights today's date.
- **Date Navigation**: Buttons allow moving to previous/next month, updating the calendar grid.
- **Day Selection**: Clicking a valid day opens a popup to add/edit events.
- **Event Popup**: Lets you specify the time and details for your event. Supports both creating and updating events.
- **Event List**: Events are listed with date, time, description, and actionable icons (edit/delete).
- **Responsive Styling**: Adjusts to screen size, providing a great UX on desktop and mobile.

---

## Component Overview

### `App.jsx`

```javascript
import CalendarApp from "./Components/CalendarApp";
import "./Components/CalendarApp.css";

const App = () => (
  <div className="container">
    <CalendarApp />
  </div>
);

export default App;
```

---

### `CalendarApp.jsx`

Handles all state and logic for the calendar and event management system.

**Key State Variables:**

- `currentMonth`, `currentYear`: Calendar navigation.
- `selectedDate`: Currently selected date.
- `showEventPopup`: Popup visibility for event input.
- `events`: Array of event objects `{ id, date, time, text }`.
- `eventTime`, `eventText`: For popup input.
- `editingEvent`: Stores the event being edited.

**Core Functions:**

- `prevMonth`/`nextMonth`: For navigating months.
- `handleDayClick`: Shows event popup for selected day.
- `handleEventSubmit`: Adds or updates events.
- `handleEditEvent`: Loads event data into popup for editing.
- `handleDeleteEvent`: Removes event from list.
- `handleTimeChange`: Updates time input state.

**Rendering:**

- Calendar grid with days and highlights.
- Event popup for input.
- Scrollable event list with edit/delete actions.

---

### `CalendarApp.css`

Handles all visual aspects, including:

- Layout (flexbox, aspect ratios)
- Calendar grid styling
- Responsive design (media queries)
- Popup and button styles
- Event list formatting

---

## Styling & Responsiveness

The project uses **custom CSS** for all styling:

- Modern dark theme with accent colors
- Flexbox for layout management
- Responsive grid and popup scaling
- Media queries for device adaptation

---

## Code Examples

### Adding an Event

```javascript
const handleEventSubmit = () => {
  const newEvent = {
    id: editingEvent ? editingEvent.id : Date.now(),
    date: selectedDate,
    time: `${eventTime.hours.padStart(2, "0")}:${eventTime.minutes.padStart(2, "0")}`,
    text: eventText,
  };
  let updatedEvents = [...events];
  if (editingEvent) {
    updatedEvents = updatedEvents.map((event) =>
      event.id === editingEvent.id ? newEvent : event,
    );
  } else {
    updatedEvents.push(newEvent);
  }
  updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  setEvents(updatedEvents);
  setEventTime({ hours: "00", minutes: "00" });
  setEventText("");
  setShowEventPopup(false);
  setEditingEvent(null);
};
```

---

### Calendar Navigation

```javascript
const prevMonth = () => {
  setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
};

const nextMonth = () => {
  setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
  setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
};
```

---

## Learning Points & Keywords

- **React Functional Components**
- **React useState Hook**
- **Vite Project Setup**
- **Component-Based Architecture**
- **Event Handling in React**
- **Conditional Rendering**
- **Array Manipulation**
- **Responsive CSS Design**
- **Flexbox & Grid Layouts**
- **UI/UX for Calendars and To-Do Apps**
- **Popup Modal Implementation**
- **Boxicons Usage**
- **Code Organization and Cleanliness**
- **Extendable for LocalStorage or Backend**

---

## Conclusion

Calendar-To-Do--ReactVite is a simple yet powerful project to help you learn and demonstrate modern React and Vite workflow, state management, event handling, and responsive design. It’s a great codebase to extend with more features (authentication, storage, notifications, etc.) as you grow your skills!

---

## Happy Coding! 🚀

Thank you for exploring and using this project.  
Feel free to fork, modify, and share with your friends and community!

---
