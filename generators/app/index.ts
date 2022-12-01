import BaseGenerator from "../../lib/base";

export default class AppGenerator extends BaseGenerator {
  answers: { template: "sample" | "tip3" | "tip4" | "empty" };
  constructor(args, options) {
    super(args, options);
    this.option("template", {
      type: String,
      alias: "t",
      description: `Template to create project: 'sample' | 'tip3' | 'tip4' | 'empty'`,
    });
    if (this.options.help) {
      return;
    }
  }
  async initializing() {
    this.initialize();
    this.options.initialized = true;
  }

  async prompting() {
    this.log(
      `\n----------------------------------------------------------------\n\tSelect project template\n----------------------------------------------------------------`
    );
    const questions = [
      {
        name: "template",
        type: "list",
        message: "Choose template",
        desc: "choose one of the following templates",
        choices: [
          { name: "Sample project", value: "sample" },
          { name: "Fungible token (TIP3)", value: "tip3" },
          { name: "Non fungible token (TIP4)", value: "tip4" },
          {
            name: "Create locklift config without any templates (empty)",
            value: "empty",
          },
        ],
        when: !this.options.template,
      },
    ];
    this.answers = await this.prompt(questions);
  }
  default() {
    switch (this.answers.template || this.options.template) {
      case "sample": {
        this.composeWith(require.resolve("../sample"), this.options);
        break;
      }
      case "tip3": {
        this.composeWith(require.resolve("../tip3"), this.options);
        break;
      }
      case "tip4": {
        this.composeWith(require.resolve("../tip4"), this.options);
        break;
      }
      default: {
        break;
      }
    }
  }
}
