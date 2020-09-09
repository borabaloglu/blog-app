import * as chalk from 'chalk';

function parseIntOrError(name: string): number {
  const parsedOption = +process.env[name];

  if (Number.isNaN(parsedOption) || Math.floor(parsedOption) !== parsedOption) {
    console.log(
      `${chalk.red.bold(
        '(!)',
      )} Invalid environment configuration detected: Expected an integer for option "${name}", instead got "${
        process.env[name]
      }".`,
    );
    process.exit(1);
  }

  return parsedOption;
}

export function loadEnvOrError(name: string, parseInt: boolean = false): any {
  if (typeof process.env[name] === 'undefined' || process.env[name] === null) {
    console.log(`${chalk.red.bold('(!)')} ${name} is not defined in your env file.`);
    process.exit(1);
  }

  if (parseInt) {
    return parseIntOrError(name);
  }

  return process.env[name];
}

export function parseIntFromEnvOrDefault(name: string, defaultValue: number): number {
  if (typeof process.env[name] === 'undefined' || process.env[name] === null) {
    return defaultValue;
  }

  return parseIntOrError(name);
}
