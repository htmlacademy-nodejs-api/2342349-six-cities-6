import chalk from 'chalk';
import {CommandParser} from './command-parser.js';
import {Command} from './commands/command.interface.js';

export class CliApplication {
  private commands: Record<string, Command> = {};
  private readonly defaultCommand: string = '--help';

  public registerCommands(commandsForRegistration: Command[]): void {
    commandsForRegistration.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command '${command.getName()}' is already registered.`);
      }
      this.commands[command.getName()] = command;
    });
  }

  public processCommand(args: string[]) {
    const parsedCommand = CommandParser.parse(args);
    const commands = Object.keys(parsedCommand);
    if (commands.length === 0) {
      commands.push(this.defaultCommand);
    }
    commands.forEach((commandName) => {
      const commandArguments = parsedCommand[commandName] ?? [];
      if (!Object.hasOwn(this.commands, commandName)) {
        console.error(`Command '${commandName}' does not exist.`);
      } else {
        console.info(chalk.blue(`Executing a command: ${commandName} ${commandArguments}`));
        this.commands[commandName].execute(...commandArguments);
      }
    });
  }
}
