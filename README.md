# n8n-nodes-table-parse

This is an n8n community node that provides HTML table parsing functionality, converting HTML tables into JSON format.

## Features

- Parse HTML tables to JSON objects
- Option to use the first row as header
- Clean and normalize table data
- Output either as separate tables or combined in a single output

## Installation

Follow these instructions to install this node in your n8n instance:

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings > Community Nodes**
3. Search for "n8n-nodes-table-parse"
4. Click **Install**
5. Restart n8n

### Manual Installation

1. Go to your n8n installation directory
2. Run `npm install n8n-nodes-table-parse`
3. Restart n8n

## Usage

1. Add the "HTML Table Parse" node to your workflow
2. Connect it to a node that outputs HTML content (e.g., HTTP Request)
3. Configure the node:
   - Set "HTML Source" to the HTML string containing tables
   - Configure options as needed:
     - Use First Row as Header: Whether to use the first row as header names
     - Output Format: Choose between "Separate Tables" or "Single Output"
     - Clean Data: Whether to clean and normalize data in cells

## Example

1. HTTP Request node: Fetch a webpage with tables
2. HTML Table Parse node: Parse the tables from the HTTP response
3. Process the resulting JSON as needed (e.g., save to a database, send via email)

## Credits

This node is powered by the [tabletojson](https://github.com/maugenst/tabletojson) npm package.

## License

MIT 

## Develop with love by ❤️ [Omelet](https://omelet.tech)