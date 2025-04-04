import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import * as cheerio from 'cheerio';

export class TableParse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HTML Table Parse',
		name: 'tableParse',
		icon: 'file:tableparse.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Parse HTML tables into JSON format',
		defaults: {
			name: 'HTML Table Parse',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Parse Tables',
						value: 'parseTables',
						description: 'Parse all tables found in HTML to JSON',
						action: 'Parse all tables in HTML to JSON',
					},
				],
				default: 'parseTables',
			},
			{
				displayName: 'HTML Source',
				name: 'htmlSource',
				type: 'string',
				default: '',
				description: 'The HTML string containing tables to parse',
				required: true,
				displayOptions: {
					show: {
						operation: ['parseTables'],
					},
				},
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Use First Row as Header',
						name: 'useFirstRowAsHeader',
						type: 'boolean',
						default: true,
						description: 'Whether to use the first row as header names',
					},
					{
						displayName: 'Output Format',
						name: 'outputFormat',
						type: 'options',
						options: [
							{
								name: 'Separate Tables',
								value: 'separateTables',
								description: 'Each table becomes a separate item in the output',
							},
							{
								name: 'Single Output',
								value: 'singleOutput',
								description: 'All tables combined in a single output item',
							},
						],
						default: 'separateTables',
						description: 'How the tables should be structured in the output',
					},
					{
						displayName: 'Clean Data',
						name: 'cleanData',
						type: 'boolean',
						default: true,
						description: 'Whether to clean and normalize data in cells',
					},
				],
				displayOptions: {
					show: {
						operation: ['parseTables'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				
				if (operation === 'parseTables') {
					const htmlSource = this.getNodeParameter('htmlSource', itemIndex) as string;
					const options = this.getNodeParameter('options', itemIndex, {}) as {
						useFirstRowAsHeader: boolean;
						outputFormat: string;
						cleanData: boolean;
					};
					
					// Load HTML with cheerio
					const $ = cheerio.load(htmlSource);
					const tables: any[] = [];
					
					// Process each table
					$('table').each((tableIndex, tableElement) => {
						const rows: string[][] = [];
						
						// Process each row
						$(tableElement).find('tr').each((rowIndex, rowElement) => {
							const cells: string[] = [];
							
							// Process each cell (both th and td)
							$(rowElement).find('th, td').each((cellIndex, cellElement) => {
								let cellContent = $(cellElement).text();
								if (options.cleanData) {
									cellContent = cellContent.trim();
								}
								cells.push(cellContent);
							});
							
							if (cells.length > 0) {
								rows.push(cells);
							}
						});
						
						if (rows.length > 0) {
							if (options.useFirstRowAsHeader && rows.length > 1) {
								// Convert rows to objects with headers
								const headers = rows[0];
								const tableData = rows.slice(1).map(row => {
									const rowObject: Record<string, string> = {};
									headers.forEach((header, index) => {
										if (index < row.length) {
											rowObject[header] = row[index];
										}
									});
									return rowObject;
								});
								tables.push(tableData);
							} else {
								// Just use raw row data
								tables.push(rows);
							}
						}
					});
					
					if (options.outputFormat === 'singleOutput') {
						// Return all tables as a single item
						returnData.push({
							json: { tables },
							pairedItem: { item: itemIndex },
						});
					} else {
						// Return each table as a separate item
						tables.forEach((tableData, tableIndex) => {
							returnData.push({
								json: {
									tableIndex,
									tableData,
								},
								pairedItem: { item: itemIndex },
							});
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
} 