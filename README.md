# Portfolio Website

A modern, responsive portfolio website showcasing my development projects, artwork, and music. Built with Flask and designed for HKU IDT application.

## Features

- **Interactive Homepage**: Beautiful landing page with animated statistics and floating cards
- **Project Showcase**: Detailed project pages with filtering, PDF preview, and download functionality
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Document Integration**: PDF preview and download functionality for project documentation

## Technology Stack

- **Backend**: Python, Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Custom CSS with modern design principles
- **Deployment**: Render.com

## Project Structure

```
Portfolio/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── Procfile              # Render deployment configuration
├── render.yaml           # Render service configuration
├── templates/            # HTML templates
│   ├── base.html         # Base template
│   ├── home.html         # Homepage
│   ├── about.html        # About page
│   ├── projects.html     # Projects listing
│   ├── project_detail.html # Project detail page
│   ├── artwork.html      # Artwork page
│   ├── music.html        # Music page
│   └── contact.html      # Contact page
└── static/               # Static assets
    ├── css/
    │   └── style.css     # Main stylesheet
    ├── js/
    │   └── main.js       # JavaScript functionality
    └── documents/        # Project documentation PDFs
```

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Open http://localhost:5000 in your browser

## Deployment on Render

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Render
3. Render will automatically detect the Python environment and deploy your application

## Projects Featured

- **Frankenstories**: AI-powered story generation from reusable parts
- **Dwen Dwen's Neighbour**: China wildlife protection education platform
- **Music Android App**: Multiplayer music guessing game
- **Desktop Mahjong Game**: Cross-platform desktop application
- **Event Management System**: Full-stack ticketing platform
- **Campus Food Ordering**: Online ordering system

## Contact

- Email: 18518599155@163.com
- GitHub: [Your GitHub Profile]
- LinkedIn: [Your LinkedIn Profile]
