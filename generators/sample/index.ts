import BaseGenerator, { PkgJSONGenerator } from '../../lib/base';

export default class SampleGenerator extends BaseGenerator {
  constructor(args, options) {
    super(args, options);
    this.option('compiler', {
      type: String,
      default: '0.61.2',
      description: `Compiler version`,
    });
    this.option('linker', {
      type: String,
      default: '0.15.48',
      description: `Compiler version`,
    });
    if (this.options.help) {
      return;
    }
  }
  initializing() {
    if (!this.options.initialized) {
      this.initialize();
    }
    if (this.options.locklift) {
      this.composeWith(require.resolve('../locklift'), this.options);
    }
    this.pkgJSONGenerator = new PkgJSONGenerator(this.args, this.options);
  }
  async prompting() {
    await this.pkgJSONGenerator._promptPkgJSON();
  }

  writing() {
    this.pkgJSONGenerator._writePkgJSON();
    this.fs.copy(
      this.templatePath('contracts/'),
      this.destinationPath('./contracts'),
    );
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { pkgManager: this.pkgJSONGenerator.pkgManager },
    );
    this.fs.copyTpl(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json'),
    );

    if (this.options.locklift) {
      const pkgJSONScripts = {
        scripts: {
          build: 'npx locklift build',
          'run:local-node':
            'docker run --rm -d --name local-node -e USER_AGREEMENT=yes -p 80:80 tonlabs/local-node',
          'stop:local-node': 'docker stop local-node',
          'deploy:testnet':
            'npx locklift run --network testnet --script scripts/00-deploy-sample.ts',
          'deploy:mainnet':
            'npx locklift run --network mainnet --script scripts/00-deploy-sample.ts',
          cleanup: 'docker stop local-node && docker rm local-node',
        },
        devDependencies: {
          'everscale-standalone-client': '^2.1.1',
          locklift: '^2.3.0',
        },
      };

      this.fs.extendJSON(this.destinationPath('package.json'), pkgJSONScripts);
      this.fs.copyTpl(
        this.templatePath('./scripts/'),
        this.destinationPath('./scripts'),
      );
      this.fs.copyTpl(
        this.templatePath('./test/'),
        this.destinationPath('./test'),
      );
    }
  }

  async install() {
    await this.spawnCommandSync(this.pkgJSONGenerator.pkgManager, ['install']);
  }

  async end() {
    if (this.options.locklift) {
      await this.spawnCommandSync(this.pkgJSONGenerator.pkgManager, [
        'run',
        'build',
      ]);
    }
    const readmePath = this._findRelativePath(
      this.env.cwd,
      this.destinationPath('README.md'),
    );

    this.log(
      `\n----------------------------------------------------------------\n\tCongrats! The project was created.\nPlease, follow the instructions in README.md to find the next steps.\nYou can find README at: ${readmePath}\n----------------------------------------------------------------`,
    );
  }
}
