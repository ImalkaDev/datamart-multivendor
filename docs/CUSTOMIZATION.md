# Customization Guide

DataMart uses Tailwind CSS and Shadcn UI, making it extremely easy to rebrand.

## Changing Colors
To change the primary colors of your marketplace, open `src/app/globals.css`.
Look for the `:root` and `.dark` variables.
Modify the `--primary` variable to change the main brand color.

## Changing Logos
Replace the following files in the `public/` directory with your own images (ensure you keep the same file names and formats):
- `logo.svg`
- `favicon.ico`

## Updating Site Metadata
You can update your site's default title and description from the Admin Dashboard -> SEO Settings.
