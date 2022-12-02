import * as Generator from "yeoman-generator";
import * as p from "path";
import validate = require("validate-npm-package-name");

export class PkgJSONGenerator extends Generator {
  answers: any;
  pkgJSON: any;
  pkgManager: "npm" | "yarn";

  constructor(args, options) {
    super(args, options);

    this.contextRoot = this.destinationRoot(this.options.path);
    this.pkgJSON = this.fs.readJSON(this.destinationPath("package.json"));
  }

  _authorQuestions(): Generator.Questions<Generator.Answers> {
    return [
      {
        name: "name",
        message: "Enter author's Name",

        default: this.user.git.name(),
        store: true,
      },
      {
        name: "email",
        message: "Enter author's Email",

        default: this.user.git.email(),
        store: true,
      },
      {
        name: "url",
        message: "Enter author's Homepage",

        store: true,
      },
    ];
  }
  _allQuestions(): Generator.Questions<Generator.Answers> {
    return [
      {
        name: "pkgManager",
        type: "list",
        message: "Select package manager",
        default: "npm",
        choices: [
          { name: "npm", value: "npm" },
          { name: "yarn", value: "yarn" },
        ],
        when: !this.options.pkgManager,
      },
      {
        name: "pkgName",
        message: "Enter package name",
        default: p.basename(this.destinationPath()),
        validate(input: string): boolean {
          const isValid = validate(input);
          if (isValid.validForNewPackages) {
            return true;
          }
          throw Error("Please provide a valid npm package name");
        },
        when: !this.options.pkgName,
      },
      {
        name: "description",
        message: "Set package description",
        when: !this.options.description,
      },
      {
        name: "homepage",
        message: "Set package homepage url",
        when: !this.options.homepage,
      },
      {
        name: "keywords",
        message: "Enter package keywords (comma to split)",
        filter(words) {
          return words.split(/\s*,\s*/g);
        },
        when: !this.options.keywords,
      },
      {
        name: "license",
        message: "Set license for your package",
        default: "Apache-2.0",
        when: !this.options.license,
      },
    ];
  }
  _notAnsweredQuestions(): Generator.Questions<Generator.Answers> {
    const allQuestions = this._allQuestions();
    const questions = [];
    for (const q in allQuestions) {
      if (Object.prototype.hasOwnProperty.call(allQuestions, q)) {
        const element = allQuestions[q];
        if (!(element.name in this.pkgJSON)) {
          questions.push(element);
        }
      }
    }
    return questions;
  }

  async _promptPkgJSON() {
    this.log(
      "\n----------------------------------------------------------------\n\tSetting up package.JSON\n----------------------------------------------------------------",
    );
    const questions = this.pkgJSON ? this._notAnsweredQuestions() : this._allQuestions();

    this.answers = await this.prompt(questions);

    if (!this.pkgJSON || !("author" in this.pkgJSON)) {
      const authorAnswers = await this.prompt(this._authorQuestions());
      this.answers = { ...this.answers, author: authorAnswers };
    }
    this.pkgManager = this.answers.pkgManager ? this.answers.pkgManager : this.options.pkgManager;
    delete this.answers.pkgManager;
  }

  _writePkgJSON() {
    const name = this.pkgJSON?.name || this.answers?.pkgName || this.options?.pkgName;
    const pkgJSON = {
      name: this.pkgJSON?.name || this.answers?.pkgName || this.options?.pkgName,
      description: this.pkgJSON?.description || this.answers?.description || this.options?.description,
      license: this.pkgJSON?.license || this.answers?.license || this.options?.license,
      author: this.pkgJSON?.author || this.answers?.author || this.options?.author,
      homepage: this.pkgJSON?.homepage || this.answers?.homepage || this.options?.homepage,
      keywords: this.pkgJSON?.keywords || this.answers?.keywords || this.options?.keywords,
      ...this.pkgJSON,
    };

    this.fs.extendJSON(this.destinationPath("package.json"), pkgJSON);
  }
}

// https://yeoman.io/authoring/running-context.html
// initializing - Your initialization methods (checking current project state, getting configs, etc)
// prompting - Where you prompt users for options (where you’d call this.prompt())
// configuring - Saving configurations and configure the project (creating .editorconfig files and other metadata files)
// default - If the method name doesn’t match a priority, it will be pushed to this group.
// writing - Where you write the generator specific files (routes, controllers, etc)
// conflicts - Where conflicts are handled (used internally)
// install - Where installations are run (npm, bower)
// end - Called last, cleanup, say good bye, etc

export default class BaseGenerator extends Generator {
  pkgJSONGenerator: PkgJSONGenerator;
  constructor(args, options) {
    super(args, options);

    // common arguments
    this.argument("path", {
      description: "Path to the project folder",
      default: ".",
      required: false,
      type: String,
    });

    // common options
    this.option("config", {
      type: String,
      description: `Path to the config file`,
    });
    this.option("locklift", {
      type: Boolean,
      default: true,
      description: "Use Locklift as a development environment?",
    });
    this.option("pkg-manager", {
      type: String,
      description: `Package manager to use (npm|yarn)`,
    });
  }

  _readConfigFile(path: string) {
    const configPath = p.isAbsolute(path) ? path : p.join(this.contextRoot, path);

    return JSON.parse(this.fs.read(configPath));
  }

  // read configs, update this.options with configs if option is not specified already
  _readOptionsFromConfig() {
    const configFile = this._readConfigFile(this.options.config);
    Object.keys(configFile).map(key => {
      this.config.set(key, configFile[key]);
    });

    const configs = this.config.getAll();
    for (const key in configs) {
      this.options[key] = configs[key];
    }
  }
  _findRelativePath(cwd: string, destinationPath: string): string {
    return p.relative(cwd, destinationPath);
  }

  initialize() {
    this.options.path = this.args.join("-");
    if (this.options.config) {
      this._readOptionsFromConfig();
    }
    this.contextRoot = this.destinationRoot(this.options.path);
  }
}

export function validateAddress(input: string): boolean {
  // valid if input is empty
  if (input.length == 0) {
    return true;
  }
  if (/^0:([A-Fa-f0-9]{64})/g.test(input)) {
    return true;
  }

  throw Error(
    "Please provide a valid venom address. \nFor example:\n0:0000000000000000000000000000000000000000000000000000000000000000",
  );
}
