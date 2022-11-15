import { Options } from '@paljs/types'
import { GenerateNexus } from './nexus'

type GeneratorConfig = { name: "nexus"; schemaPath: string }

export class Generator {
  private generator: GeneratorConfig
  private options?: Partial<Options>

  generators: {
    nexus: GenerateNexus;
  };

  constructor (generator: GeneratorConfig, options?: Partial<Options>) {
    this.generator = generator
    this.options = options

    this.generators = {
      nexus: new GenerateNexus(this.generator.schemaPath, this.options)
    }
  }

  async run () {
    if (this.generators[this.generator.name]) {
      await this.generators[this.generator.name].run()
    } else {
      console.error(
        `Your generator name: "${this.generator.name}" not correct.\nPlease use one of this`,
        Object.keys(this.generators)
      )
    }
  }
}
