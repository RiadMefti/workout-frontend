# Workout Tracker

## Overview

Workout Tracker is a web application designed to help users manage and track their workout routines. The app allows users to create, edit, and delete workout splits, set an active split, and record their workouts. Users can also view their workout history and monitor their progress over time.

## Features

- **Create Workout Splits**: Users can create multiple workout splits, each containing various workouts and exercises.
- **Edit Workout Splits**: Users can edit the details of their workout splits, including adding or removing workouts and exercises.
- **Set Active Split**: Users can set a workout split as active, which will be used for their next workout session.
- **Record Workouts**: Users can record their workouts by entering details for each exercise, such as sets, reps, weight, duration, and distance.
- **View Workout History**: Users can view their workout history and analyze their performance over time.
- **Responsive Design**: The app is designed to work seamlessly on both desktop and mobile devices.

## Live Application

Visit the live application at: [v2.workoutmadeeasy.com](https://v2.workoutmadeeasy.com)

## Related Repositories

- Backend Repository: [workout-backend](https://github.com/RiadMefti/workout-backend)

## Technologies Used

- **React**: A JavaScript library for building user interfaces
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript
- **Vite**: A build tool that provides a fast development environment
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development
- **Shadcn UI**: A set of accessible and customizable UI components
- **Date-fns**: A modern JavaScript date utility library
- **Lucide-react**: A collection of icons for React

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 16.0 or higher)
- npm (version 7.0 or higher)

## Getting Started

To get started with the Workout Tracker app, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/workout-tracker.git
   cd workout-tracker
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add required environment variables:

   ```sh
   VITE_API_URL=your_api_url_here
   ```

4. Run the development server:

   ```sh
   npm run dev
   ```

5. Build the project:

   ```sh
   npm run build
   ```

6. All the above commands can also be done with Bun

## Project Structure

```
workout-tracker/
├── src/
│   ├── api/           # API clients for interacting with the backend
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom hooks for managing state and side effects
│   ├── pages/         # Page components representing different views
│   ├── routes/        # Route components for handling navigation
│   ├── lib/           # Utility functions and helpers
│   ├── types.ts       # Type definitions for TypeScript
│   └── main.tsx       # Application entry point
├── public/            # Static assets
├── index.html         # HTML entry point
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
└── package.json       # Project dependencies and scripts
```

## Available Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Builds the app for production
- `npm run preview`: Locally preview the production build
- `npm run lint`: Runs ESLint to check code quality
- `npm run format`: Formats code using Prettier
