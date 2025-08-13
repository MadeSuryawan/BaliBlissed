# Destination Hero Images Updater 🏖️

This Python package updates hero images in destination pages. It reads image mappings from `destination_images.json`, processes HTML files to update image sources and attributes, sorts destination cards alphabetically, and saves the updated HTML files.

## 🧐 Overview

- Reads image mappings from `destination_images.json`
- Processes HTML files to update image sources and attributes
- Sorts destination cards alphabetically
- Saves the updated HTML files

## 📁 Files

- `main.py`: Main script for processing destination images
- `helpers.py`: Helper functions for image processing
- `destination_images.json`: JSON file containing destination image data
- `pyproject.toml`: Python project configuration
- `uv.lock`: Python dependency lock file

## 💻 Requirements

- Python 3.13+
- [uv](https://github.com/astral-sh/uv) for dependency management

## 🚀 Installation and Usage

This package uses `uv` for dependency management. To set up and run the package:

1. Install `uv` if you haven't already:

    ```bash
    pip install uv
    ```

2. The project dependencies are managed in `pyproject.toml` and locked in `uv.lock`. To install dependencies:

    ```bash
    uv sync
    ```

3. Run the main script:

    ```bash
    uv run main.py
    ```

## 📄 Data Structure

The `destination_images.json` file contains image data in the following format:

```json
{
    "Destination Name": "path/to/image.webp"
}
```

## 🧰 Main Functions

The package provides the following main functions:

- `update_img_src()`: Main function that processes and updates all images
- `update_dest_cards()`: Updates image sources in destination cards
- `update_dest_pages()`: Updates hero images in destination pages

## 🧰 Helper Functions

The package also includes the following helper functions:

- `load_json()`: Loads and sorts JSON data from a file
- `write_html()`: Writes HTML content back to a file
- `error_var()`: Handles error reporting and display
