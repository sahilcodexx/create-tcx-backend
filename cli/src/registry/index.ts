import { GeneratorPlugin, ProjectContext } from './types.js';

export class PluginRegistry {
  private frameworks = new Map<string, GeneratorPlugin>();
  private databases = new Map<string, GeneratorPlugin>();
  private orms = new Map<string, GeneratorPlugin>();
  private plugins = new Map<string, GeneratorPlugin>();

  registerFramework(name: string, plugin: GeneratorPlugin) {
    this.frameworks.set(name, plugin);
  }

  registerDatabase(name: string, plugin: GeneratorPlugin) {
    this.databases.set(name, plugin);
  }

  registerORM(name: string, plugin: GeneratorPlugin) {
    this.orms.set(name, plugin);
  }

  registerPlugin(name: string, plugin: GeneratorPlugin) {
    this.plugins.set(name, plugin);
  }

  async run(ctx: ProjectContext) {
    const activePlugins: GeneratorPlugin[] = [];

    // Framework
    const fw = this.frameworks.get(ctx.framework);
    if (fw) activePlugins.push(fw);

    // Database
    const db = this.databases.get(ctx.database);
    if (db) activePlugins.push(db);

    // ORM
    const orm = this.orms.get(ctx.orm);
    if (orm) activePlugins.push(orm);

    // Dynamic plugins
    if (ctx.auth !== 'none') {
      const authPlugin = this.plugins.get(`auth-${ctx.auth}`);
      if (authPlugin) activePlugins.push(authPlugin);
    }

    if (ctx.validation !== 'none') {
      const valPlugin = this.plugins.get(`validation-${ctx.validation}`);
      if (valPlugin) activePlugins.push(valPlugin);
    }

    if (ctx.docker) {
      const dockerPlugin = this.plugins.get('docker');
      if (dockerPlugin) activePlugins.push(dockerPlugin);
    }

    if (ctx.swagger) {
      const swaggerPlugin = this.plugins.get('swagger');
      if (swaggerPlugin) activePlugins.push(swaggerPlugin);
    }

    if (ctx.eslint) {
      const eslintPlugin = this.plugins.get('eslint');
      if (eslintPlugin) activePlugins.push(eslintPlugin);
    }

    if (ctx.prettier) {
      const prettierPlugin = this.plugins.get('prettier');
      if (prettierPlugin) activePlugins.push(prettierPlugin);
    }

    if (ctx.husky) {
      const huskyPlugin = this.plugins.get('husky');
      if (huskyPlugin) activePlugins.push(huskyPlugin);
    }

    // Apply install hooks (dependencies injection)
    for (const plugin of activePlugins) {
      if (plugin.onInstall) {
        await plugin.onInstall(ctx);
      }
    }

    // Apply generate hooks (file construction)
    for (const plugin of activePlugins) {
      if (plugin.onGenerate) {
        await plugin.onGenerate(ctx);
      }
    }
  }
}

export const registry = new PluginRegistry();
export * from './types.js';
