# Homebrew Package Wizard

A modern web application to help macOS users select and install Homebrew packages with ease. This tool simplifies the process of discovering and installing software packages through Homebrew.

## Features

- **Categorized Packages**: Browse packages organized by functional categories
- **One-Click Selection**: Easily select packages with a simple click
- **Automatic Command Generation**: Get ready-to-use Homebrew commands
- **Expandable Categories**: Collapse or expand categories to focus on what you need
- **Cask Support**: Install GUI applications with Homebrew Cask
- **Tap Support**: Access packages from third-party repositories

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/wstein/brewiz.git
   cd brewiz
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:

   ```
   http://localhost:8047
   ```

## Usage

1. **Browse Categories**: Explore different categories of packages
2. **Select Packages**: Click on packages you want to install
3. **Copy Commands**: Use the generated Homebrew commands at the bottom of the page
4. **Install Packages**: Paste the commands in your terminal to install the selected packages

## How It Works

- **Package Selection**: When you click on a package, it's added to your selection list
- **Command Generation**: The app automatically generates the appropriate Homebrew commands
- **Cask Detection**: GUI applications are automatically installed with the `--cask` flag
- **Tap Integration**: Packages from third-party repositories include the tap in the formula name

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

## Technologies Used

- **SolidJS**: Fast, reactive UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Next-generation frontend tooling

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.