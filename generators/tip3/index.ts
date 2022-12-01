import BaseGenerator, { PkgJSONGenerator, validateAddress } from "../../lib/base";
import * as Generator from "yeoman-generator";

export default class TIP3 extends BaseGenerator {
  answers: any;

  constructor(args, options) {
    super(args, options);
    this.option("compiler", {
      type: String,
      default: "0.59.0",
      description: `Compiler version`,
    });
    this.option("linker", {
      type: String,
      default: "0.15.48",
      description: `Linker version`,
    });

    this.option("root-owner-address", {
      type: String,
      description: `Address of the contract root owner`,
    });
    this.option("token-name", {
      type: String,
      description: `The name of your token`,
    });
    this.option("token-symbol", {
      type: String,
      description: `The symbol of your token`,
    });
    this.option("decimals", {
      type: Number,
      description: `The number of decimals that your token should have`,
    });
    this.option("initial-supply", {
      type: String,
      description: `The number of tokens that will be issued immediately after deployment`,
    });
    this.option("initial-supply-to", {
      type: String,
      description: `Address of initial token supply recipient`,
    });
    this.option("disable-mint", {
      type: Boolean,
      description: `Disables additional emission of tokens`,
    });
    this.option("disable-burn", {
      type: Boolean,
      description: `Disables tokens burning`,
    });
    this.option("pause-burn", {
      type: Boolean,
      description: `Temporarily disables token burning`,
    });
    this.option("remaining-gas-to", {
      type: String,
      description: `Address to send the remaining gas`,
    });
    if (this.options.help) {
      return;
    }
  }
  _contractQuestions(): Generator.Questions {
    return [
      {
        name: "rootOwnerAddress",
        type: "input",
        message: "Enter the address of the contract root owner",
        validate: validateAddress,
        when: !this.options.rootOwnerAddress,
      },
      {
        name: "tokenName",
        type: "input",
        message: "Enter the name of your token",
        default: "First Venom Token",
        when: !this.options.tokenName,
      },
      {
        name: "tokenSymbol",
        type: "input",
        message: "Enter the symbol of your token",
        default: "FVT",
        when: !this.options.tokenSymbol,
      },
      {
        name: "decimals",
        type: "input",
        message: "How many decimals will the token have?",
        default: 18,
        when: !this.options.decimals,
      },
      {
        name: "initialSupply",
        type: "input",
        message:
          "Specify the number of tokens that will be issued immediately after deployment (will be shifted by decimals)",
        default: "1000000000",
        when: !this.options.initialSupply,
      },
      {
        name: "initialSupplyTo",
        type: "input",
        message: "Enter the address to send initially minted tokens",
        validate: validateAddress,
        when: !this.options.initialSupplyTo,
      },
      {
        name: "disableMint",
        type: "confirm",
        message: "Disable additional emission of tokens?",
        default: false,
        when: !this.options.disableMint,
      },
      {
        name: "disableBurn",
        type: "confirm",
        message: "Disable tokens burn?",
        default: false,
        when: !this.options.disableBurn,
      },
      {
        name: "pauseBurn",
        type: "confirm",
        message:
          "Pause ability to burn tokens? Pause ability to burn tokens? Available only if tokens burning were enabled in the previous step",
        default: false,
        when: !this.options.pauseBurn,
      },
      {
        name: "remainingGasTo",
        type: "input",
        message: "Enter the address to send the remaining gas",
        validate: validateAddress,
        when: !this.options.remainingGasTo,
      },
    ];
  }

  initializing() {
    if (!this.options.initialized) {
      this.initialize();
    }
    if (this.options.locklift) {
      this.composeWith(require.resolve("../locklift"), this.options);
    }
    this.pkgJSONGenerator = new PkgJSONGenerator(this.args, this.options);
  }

  async prompting() {
    await this.pkgJSONGenerator._promptPkgJSON();
    this.log(
      "\n----------------------------------------------------------------\n\tSetting up tip3 project\n----------------------------------------------------------------",
    );

    if (this.options.locklift) {
      const answers = await this.prompt(this._contractQuestions());

      const contractAnswers = {
        rootOwnerAddress: answers.rootOwnerAddress || this.options.rootOwnerAddress,
        remainingGasTo: answers.remainingGasTo || this.options.remainingGasTo,
        tokenName: answers.tokenName || this.options.tokenName,
        tokenSymbol: answers.tokenSymbol || this.options.tokenSymbol,
        initialSupplyTo: answers.initialSupplyTo || this.options.initialSupplyTo,
        initialSupply: answers.initialSupply || this.options.initialSupply,
        decimals: answers.decimals || this.options.decimals,
        disableMint: this.options.disableMint === undefined ? answers.disableMint : this.options.disableMint,
        disableBurn: this.options.disableBurn === undefined ? answers.disableBurn : this.options.disableBurn,
        pauseBurn: this.options.pauseBurn === undefined ? answers.pauseBurn : this.options.pauseBurn,
      };
      this.answers = contractAnswers;
    }
  }

  writing() {
    this.pkgJSONGenerator._writePkgJSON();

    const pkgJson = {
      devDependencies: {
        "@broxus/contracts": "^1.0.4",
        "@types/node": "^18.11.10",
        prettier: "^2.8.0",
        typescript: "^4.7.4",
      },
    };
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
    this.fs.copy(this.templatePath("contracts/"), this.destinationPath("./contracts"));
    this.fs.copyTpl(this.templatePath("README.md"), this.destinationPath("README.md"), {
      pkgManager: this.pkgJSONGenerator.pkgManager,
    });
    this.fs.copyTpl(this.templatePath("tsconfig.json"), this.destinationPath("tsconfig.json"));

    if (this.options.locklift) {
      const pkgJsonScripts = {
        scripts: {
          build: "npx locklift build",
          "run:local-node": "docker run --rm -d --name local-node -e USER_AGREEMENT=yes -p 80:80 tonlabs/local-node",
          "stop:local-node": "docker stop local-node",
          "test:local": "npx locklift test --network local",
          "test:testnet": "npx locklift test --network testnet",
          "deploy:testnet": "npx locklift run --network testnet --script scripts/00-deploy.ts",
          "deploy:mainnet": "npx locklift run --network mainnet --script scripts/00-deploy.ts",
          "mint:testnet": "npx locklift run --network testnet --script scripts/01-mint.ts",
          "mint:mainnet": "npx locklift run --network mainnet --script scripts/01-mint.ts",
          "burn:testnet": "npx locklift run --network testnet --script scripts/02-burn.ts",
          "burn:mainnet": "npx locklift run --network mainnet --script scripts/02-burn.ts",
        },
        devDependencies: {
          "@types/prompts": "^2.4.1",
          ora: "^4.0.0",
          prompts: "^2.4.2",
          "bignumber.js": "^9.1.0",
        },
      };
      this.fs.extendJSON(this.destinationPath("package.json"), pkgJsonScripts);
      // deploy script
      this.fs.copyTpl(this.templatePath("./scripts/"), this.destinationPath("./scripts"), {
        props: this.answers,
      });

      this.fs.copyTpl(this.templatePath("./test/"), this.destinationPath("./test"), {
        props: this.answers,
      });
      this.fs.copyTpl(this.templatePath(".prettierrc"), this.destinationPath(".prettierrc"));
    }
  }
  async install() {
    await this.spawnCommandSync(this.pkgJSONGenerator.pkgManager, ["install"]);
  }

  async end() {
    if (this.options.locklift) {
      await this.spawnCommandSync(this.pkgJSONGenerator.pkgManager, ["run", "build"]);
    }

    const readmePath = this._findRelativePath(this.env.cwd, this.destinationPath("README.md"));

    this.log(
      `\n----------------------------------------------------------------\n\tCongrats! The project was created.\nPlease, follow the instructions in README.md to find the next steps.\nYou can find README at: ${readmePath}\n----------------------------------------------------------------`,
    );
  }
}
