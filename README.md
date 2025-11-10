# FuelEU Maritime Compliance Dashboard - Frontend

This project is the frontend implementation for the FuelEU Maritime compliance platform assignment. It is a React application built with TypeScript and styled with TailwindCSS, developed by a human engineer with the assistance of AI tools for accelerating development.

## Overview

The dashboard provides a user interface for managing and analyzing maritime route data to ensure compliance with FuelEU regulations. It features four main sections:

1.  **Routes**: View, filter, and manage all vessel routes. Users can set a specific route as the baseline for comparison.
2.  **Compare**: Visualize the GHG intensity of various routes against the established baseline and the official compliance target. Includes a bar chart and a detailed table.
3.  **Banking**: Manage the company's Compliance Balance (CB). Users can bank a surplus from one year or apply a previously banked surplus to cover a deficit in another.
4.  **Pooling**: Simulate the creation of a compliance pool with multiple ships. The interface allows users to select members, view the aggregate CB, and validate the pool against regulatory rules before creation.

## Architecture Summary (Hexagonal Pattern)

I structured the frontend using the **Hexagonal (Ports & Adapters)** architecture to ensure a clean separation of concerns and maintainability. This pattern was chosen to isolate the core application logic from the UI framework and external services.

- `src/core/`: This is the application's core logic, kept completely independent of React.

  - `domain/`: Contains pure data structures and types (e.g., `Route`, `PoolMember`).
  - `ports/`: Defines the interfaces (`IRouteApi`, `IComplianceApi`) that serve as contracts between the core and the outside world.

- `src/adapters/`: These are the concrete implementations of the ports.

  - `ui/`: The **inbound adapter**. Contains all React components, hooks, and views that present the application to the user.
  - `infrastructure/`: The **outbound adapter**. Contains the implementation for external services, such as the `mockApi.ts` which implements the API ports for this demonstration.

- `src/shared/`: Contains shared resources like constants that can be used across the application.

This structure makes the core business logic testable in isolation and allows the UI or data-fetching libraries to be swapped out with minimal impact on the rest of the application.

## Screenshots

_(Placeholder for screenshots of the running application)_

- _Routes Tab View_
- _Compare Tab with Chart_
- _Banking Tab KPIs_
- _Pooling Tab Simulation_

## Setup & Run Instructions

To run this project locally, you will need [Node.js](https://nodejs.org/) (version 20.19+ recommended).

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    ```

2.  **Navigate to the project directory**

    ```bash
    cd FuelEU-Maritime # or your project folder name
    ```

3.  **Install dependencies**
    Run the following command to install all the necessary packages defined in `package.json`.

    ```bash
    npm install
    ```

4.  **Run the development server**
    This command starts the Vite development server.

    ```bash
    npm run dev
    ```

5.  **Open the application**
    Vite will provide a local URL in the terminal, typically `http://localhost:5173`. Open this URL in your web browser to view the application.

## How to Execute Tests

Unit and component tests are planned using **Vitest** and **React Testing Library**. The test runner is configured, and tests can be executed with:

```bash
npm run test
```

_Note: Test files have not yet been implemented as the initial focus was on establishing the architecture and core functionality._
