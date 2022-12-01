import * as Generator from "yeoman-generator";
import { validateAddress } from "../../lib/base";

interface Giver {
  type: string;
  address: string;
  privateKey: string;
  phrase: string;
}

interface NetworkConfig {
  giver: Giver;
  connection?: {
    group: string;
    type: string;
    data: {
      endpoint: string;
    };
  };
}

interface Answers {
  externalContracts: any;
  compiler: string;
  linker: string;
  networks: Map<string, NetworkConfig>;
  blockchain: "venom" | "everscale";
}

function questionsToSettingUpNetwork(network: string) {
  return [
    {
      name: `type`,
      type: "list",
      message: `Select giver type (${network})`,
      choices: ["WalletV3", "GiverWallet"],
    },
    {
      name: `address`,
      type: "input",
      message: `Provide giver address (${network})`,
      validate: validateAddress,
    },
    {
      name: `phrase`,
      type: "password",
      message: `Enter giver's seed phrase (${network})`,
    },
    {
      name: `privateKey`,
      type: "password",
      message: `Enter giver's privateKey (${network})`,
    },
  ];
}

export default class extends Generator {
  answers: Answers;

  constructor(args, options) {
    super(args, options);
  }

  initializing() {
    this.destinationRoot(this.config.get("path"));
  }

  async prompting() {
    this.log(
      "\n----------------------------------------------------------------\n\tSetting up locklift\n----------------------------------------------------------------",
    );
    const setupLocklift = await this.prompt([
      {
        name: "setupLocklift",
        type: "confirm",
        message: "Set up locklift configs now? If not, you can do it manually later.",
        default: true,
      },
    ]);

    const questions = [
      {
        name: "compiler",
        type: "input",
        message: "Enter compiler version",
        default: this.options.compiler || "0.62.0",
        when: setupLocklift.setupLocklift,
      },
      {
        name: "linker",
        type: "input",
        message: "Enter linker version",
        default: this.options.linker || "0.15.48",
        when: setupLocklift.setupLocklift,
      },
      {
        name: "blockchain",
        type: "list",
        message: "Select blockchain",
        choices: [
          {
            name: "Venom",
            value: "venom",
          },
          {
            name: "Everscale",
            value: "everscale",
          },
        ],
        when: setupLocklift.setupLocklift,
      },
    ];

    const mainAnswers = await this.prompt(questions);

    const networkAnswers = new Map<string, NetworkConfig>();
    if (setupLocklift.setupLocklift) {
      for await (const network of ["testnet", "mainnet"]) {
        const giverConfigAnswers = await this.prompt(questionsToSettingUpNetwork(network));
        networkAnswers.set(network, {
          giver: {
            address: giverConfigAnswers.address,
            type: giverConfigAnswers.type,
            privateKey: giverConfigAnswers.privateKey,
            phrase: giverConfigAnswers.phrase,
          },
        });
      }
    }

    this.answers = {
      externalContracts: this.options.externalContracts,
      compiler: mainAnswers.compiler || this.options.compiler,
      linker: mainAnswers.linker || this.options.linker,
      networks: networkAnswers,
      blockchain: mainAnswers.blockchain,
    };
  }

  writing() {
    let giverTypes = [];

    this.answers.networks.forEach((v: NetworkConfig) => {
      giverTypes.indexOf(v.giver.type) === -1 && giverTypes.push(v.giver.type);
    });
    const lockliftConfigPath = this.options.lockliftConfigPath || "locklift.config.ts";

    this.fs.copyTpl(this.templatePath(lockliftConfigPath), this.destinationPath("locklift.config.ts"), {
      compiler: this.answers.compiler,
      linker: this.answers.linker,
      networks: this.answers.networks,
      giverTypes: giverTypes,
      blockchain: this.answers.blockchain,
    });
    this.fs.copy(this.templatePath("giverSettings/"), this.destinationPath("./giverSettings"));

    const pkgJson = {
      devDependencies: {
        "@types/chai": "^4.3.4",
        "@types/mocha": "^10.0.1",
        chai: "^4.3.6",
        "everscale-standalone-client": "^2.1.5",
        locklift: "^2.4.4",
        "ts-mocha": "^10.0.0",
      },
    };
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }
}
