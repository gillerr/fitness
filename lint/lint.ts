import {execSync} from 'child_process';

class Lint {
	private static readonly esLintOptions = {
		cache: true,
		cacheLocation: 'lint/.eslintcache',
		config: 'lint/.eslintrc.yml',
		ignorePath: 'lint/.eslintignore'
	};
	private static readonly styleLintOptions = {
		allowEmptyInput: true,
		cache: true,
		cacheLocation: 'lint/.stylelintcache',
		config: 'lint/.stylelintrc.yml'
	};
	private static readonly prettierOptions = {
		cache: true,
		config: 'lint/.prettierrc.yml',
		loglevel: 'warn'
	};

	static perform(): void {
		const isFixMode = process.argv.includes('--fix');
		Lint.esLint(isFixMode);
		Lint.styleLint(isFixMode);
		Lint.prettier(isFixMode);
	}

	private static esLint(isFixMode: boolean): void {
		Lint.execute('eslint', 'ts', {...Lint.esLintOptions, fix: isFixMode});
	}

	private static styleLint(isFixMode: boolean): void {
		Lint.execute('stylelint', '{scss,css}', {...Lint.styleLintOptions, fix: isFixMode});
	}

	private static prettier(isFixMode: boolean): void {
		Lint.execute('prettier', '{ts,html,json,yml,md,css,scss}', {
			...Lint.prettierOptions,
			write: isFixMode,
			check: !isFixMode
		});
	}

	private static execute(command: string, extensions: string, options: Record<string, string | boolean>): void {
		const formattedOptions = Lint.formatOptions(options);
		const cmd = `${command}  "**/*.${extensions}" ${formattedOptions}`;
		console.info(cmd);
		execSync(cmd, {stdio: 'inherit'});
	}

	private static formatOptions(options: Record<string, string | boolean>): string {
		return Object.keys(options)
			.filter(option => options[option] !== false)
			.map(option => (options[option] === true ? option : `${option} ${options[option]}`))
			.map(option => option.replace(/[A-Z]/g, '-$&').toLowerCase())
			.map(option => `--${option}`)
			.join(' ');
	}
}

Lint.perform();
