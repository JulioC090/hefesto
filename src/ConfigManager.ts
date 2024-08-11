import fs from 'node:fs';
import path from 'node:path';

export default class ConfigManager {
  private static path: string = path.resolve(__dirname, 'config.json');

  static setPath(newPath: string) {
    this.path = newPath;
  }

  static load() {
    const data = fs.existsSync(this.path)
      ? fs.readFileSync(this.path, 'utf-8')
      : '{}';
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return {};
    }
  }

  static save(config: Record<string, unknown>) {
    try {
      fs.writeFileSync(this.path, JSON.stringify(config, null, 2));
      console.log('Config saved successfully');
    } catch (e) {
      console.error('Failed to save config:', e);
    }
  }
}
