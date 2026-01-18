import { exec } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

/**
 * 下载 Swagger JSON 文件
 * @param {string} url - Swagger API URL
 * @returns {Promise<void>}
 */
export async function downloadSwaggerJson(url: string): Promise<void> {
  const https = await import('https');
  const http = await import('http');

  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`下载失败，状态码: ${response.statusCode}`));
          return;
        }

        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            // 验证 JSON 格式
            JSON.parse(data);

            // 保存到文件
            fs.writeFileSync(path.resolve(process.cwd(), 'swagger.json'), data);
            console.log('Swagger JSON 已保存到 swagger.json');
            resolve();
          } catch (error) {
            reject(new Error('无效的 JSON 数据'));
          }
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * 执行 API 生成命令
 * @returns {Promise<void>}
 */
export async function executeGeneratorCommand(
  generatorApiExec: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    // 根据操作系统调整命令
    const isWindows = os.platform() === 'win32';
    const command = isWindows
      ? generatorApiExec.replace(/\//g, '\\')
      : generatorApiExec;

    console.log(`执行命令: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行错误: ${error.message}`);
        reject(error);
        return;
      }

      if (stderr) {
        console.error(`命令输出错误: ${stderr}`);
      }

      console.log(`命令输出: ${stdout}`);
      resolve();
    });
  });
}
