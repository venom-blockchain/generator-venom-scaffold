import BaseGenerator, { PkgJSONGenerator } from "../../lib/base";

export default class TIP41 extends BaseGenerator {
  addLocklift: boolean;

  constructor(args, options) {
    super(args, options);
    this.option("compiler", {
      type: String,
      default: "0.58.1",
      description: "Compiler version",
    });
    this.option("linker", {
      type: String,
      default: "0.15.48",
      description: "Linker version",
    });
  }

  initializing() {
    if (!this.options.initialized) {
      this.initialize();
    }
    if (this.options.locklift) {
      this.options.externalContracts = "tip4";
      this.composeWith(require.resolve("../locklift"), this.options);
    }
    this.pkgJSONGenerator = new PkgJSONGenerator(this.args, this.options);
  }
  async prompting() {
    await this.pkgJSONGenerator._promptPkgJSON();
  }

  writing() {
    this.pkgJSONGenerator._writePkgJSON();

    const pkgJson = {
      devDependencies: {
        "@types/node": "^18.16.0",
        prettier: "^2.8.0",
        typescript: "^4.7.4",
      },
      dependencies: {
        "@itgold/everscale-tip": "^1.1.4",
      },
    };
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
    if (this.options.locklift) {
      const pkgJsonScripts = {
        scripts: {
          build: "npx locklift build",
          "run:local-node": "docker run --rm -d --name local-node -e USER_AGREEMENT=yes -p 80:80 tonlabs/local-node",
          "stop:local-node": "docker stop local-node",
          "test:local": "npx locklift test --network local",
          "test:testnet": "npx locklift test --network test",
          "deploy:testnet": "npx locklift run --network test --script scripts/0-deploy-collection.ts",
          "mint:testnet": "npx locklift run --network test --script scripts/1-mint-nft.ts",
        },
        devDependencies: {
          "@types/prompts": "^2.4.1",
          prompts: "^2.4.2",
          ora: "^4.0.0",
        },
      };
      this.fs.extendJSON(this.destinationPath("package.json"), pkgJsonScripts);
      this.fs.copyTpl(this.templatePath("./scripts/"), this.destinationPath("./scripts"));
      this.fs.copyTpl(this.templatePath("./test/"), this.destinationPath("./test"));
    }
    this.fs.copy(this.templatePath("contracts/"), this.destinationPath("./contracts"));
    this.fs.copyTpl(this.templatePath("README.md"), this.destinationPath("README.md"), {
      pkgManager: this.pkgJSONGenerator.pkgManager,
    });
    this.fs.copyTpl(this.templatePath("tsconfig.json"), this.destinationPath("tsconfig.json"));
    this.fs.copyTpl(this.templatePath(".prettierrc"), this.destinationPath(".prettierrc"));
  }
  async install() {
    await this.spawnCommandSync(this.pkgJSONGenerator.pkgManager, ["install"]);
  }

  async end() {
    if (this.options.locklift) {
      const lockliftConfigPath = this.options.lockliftConfigPath || "locklift.config.ts";
      
      this.spawnCommandSync("npx", ["prettier", "--write", lockliftConfigPath]);
      this.spawnCommandSync(this.pkgJSONGenerator.pkgManager, ["run", "build"]);
    }
    const readmePath = this._findRelativePath(this.env.cwd, this.destinationPath("README.md"));

    this.log(
      `\n----------------------------------------------------------------\n\tCongrats! The project was created.\nPlease, follow the instructions in README.md to find the next steps.\nYou can find README at: ${readmePath}\n----------------------------------------------------------------`,
    );
  }
}
