import * as Generator from "yeoman-generator";
import { validateAddress } from "../../lib/base";

interface Giver {
  address: string;
  privateKey: string;
}

interface Signer {
  phrase: string;
  amount: number;
}

interface NetworkConfig {
  giver: Giver;
  signer: Signer;
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
      name: `giverAddress`,
      type: "input",
      message: `Provide giver address (${network})`,
      validate: validateAddress,
      default: "0:0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      name: `giverPrivateKey`,
      type: "password",
      message: `Enter giver's private key (${network})`,
      default: "0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      name: `signerPhrase`,
      type: "password",
      message: `Provide signer's seed phrase (${network})`,
      default: "phrase",
    },
    {
      name: `signerKeysAmount`,
      type: "number",
      message: `Provide amount of signer's key pairs to generate (${network})`,
      default: 20,
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
      let networks: string[] = [];
      switch (mainAnswers.blockchain) {
        case "venom":
          networks = ["test"];
          break;
        case "everscale":
          networks = ["test", "main"];
          break;
      }
      for await (const network of networks) {
        const answers = await this.prompt(questionsToSettingUpNetwork(network));
        networkAnswers.set(network, {
          giver: {
            address: answers.giverAddress,
            privateKey: answers.giverPrivateKey,
          },
          signer: {
            phrase: answers.signerPhrase,
            amount: answers.signerKeysAmount,
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
    const lockliftConfigPath = this.options.lockliftConfigPath || "locklift.config.ts";
    this.fs.copyTpl(this.templatePath(lockliftConfigPath), this.destinationPath("locklift.config.ts"), {
      compiler: this.answers.compiler,
      linker: this.answers.linker,
      networks: this.answers.networks,
      blockchain: this.answers.blockchain,
      externalContracts: this.options.externalContracts,
    });

    const pkgJson = {
      devDependencies: {
        "@types/chai": "^4.3.4",
        "@types/mocha": "^10.0.1",
        "@types/node": "^18.16.0",
        chai: "^4.3.7",
        "everscale-standalone-client": "^2.1.18",
        locklift: "^2.5.2",
        prettier: "^2.8.8",
        "ts-mocha": "^10.0.0",
        typescript: "^4.7.4",
      },
    };
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }
}
