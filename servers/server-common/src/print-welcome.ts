import figlet from 'figlet';
import chalk from 'chalk';

import { ServerMetadata } from './server-metadata';

export function printWelcome(title: string, metadata: ServerMetadata, width: number = 80) {
  const titleFigure = figlet.textSync(title!);
  const titleLines = titleFigure.split('\n');

  const { applicationName, applicationVersion, serverType, texoVersion, ...attributes } = metadata;

  const metaFields = [
    { name: 'App Name', value: applicationName },
    { name: 'App Version', value: applicationVersion },
    { name: 'App Type', value: serverType || '<unknown>'},
    { name: 'Texo Version', value: texoVersion || '<unknown>' }
  ];

  const lineCountDifference = Math.abs(titleLines.length - metaFields.length);
  const delta = (lineCountDifference % 2 !== 0) ? 1 : 0;
  const totalLines = Math.max(titleLines.length, metaFields.length) + delta;
  
  const nameLines = metaFields.map(attribute => attribute.name);
  const valueLines = metaFields.map(attribute => attribute.value);

  const maxNameLength = calculateMaximumLength(nameLines);
  const maxValueLength = calculateMaximumLength(valueLines);
  const maxTitleLength = width - (maxNameLength + maxValueLength + 3);
  
  padArray(titleLines, totalLines, '');
  padArray(nameLines, totalLines, '');
  padArray(valueLines, totalLines, '');
  
  const output = [];
  for (let index = 0; index < totalLines; index++) {
    const outputLine = [];

    const titleLine = titleLines[index];
    const nameLine = nameLines[index];
    const valueLine = valueLines[index];
    
    outputLine.push(chalk.green(titleLine));
    outputLine.push(' '.repeat(Math.max(0, maxTitleLength - titleLine.length)));

    outputLine.push(' '.repeat(Math.max(0, maxNameLength - nameLine.length)));
    outputLine.push(nameLine);
    outputLine.push(nameLine.length ? ': ' : '  ');

    outputLine.push(chalk.whiteBright(valueLine));  

    output.push(outputLine.join(''));
  }

  console.info(chalk.whiteBright('='.repeat(width)));
  console.info(output.join('\n'));
  console.info(chalk.whiteBright('-'.repeat(width)))

  // Attributes
  const lines: string[] = [];
  lines.push('');
  Object.entries(attributes).forEach(([ name, value ]) => { 
    lines.push(`${name}: ${chalk.whiteBright(value)}`)
  });
  lines.push('');
  console.info(lines.join('\n'));

  console.info(chalk.whiteBright('='.repeat(width)));
}

function calculateMaximumLength(items: string[]) : number {
  return items.reduce<number>((max, item) => Math.max(max, item.length), 0);
}

function padArray<T>(array: T[], size: number, blank: T) {
  const length = array.length;
  const top = Math.floor((size - length) / 2);
  const bottom = size - (length + top);

  array.unshift(...Array(top).fill(blank));
  array.push(...Array(bottom).fill(blank));
}