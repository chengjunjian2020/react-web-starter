/**
 * Swagger API 生成器
 * 用于从 Swagger JSON 生成 TypeScript API 客户端
 */
import * as fs from 'fs';
import * as path from 'path';
import { downloadSwaggerJson, executeGeneratorCommand } from './tools';

const templateDir = './generator/templates';
/**
 * Swagger API URL 配置
 * @type {string}
 */
const swaggerApiUrl =
  'http://localhost:8000/api/docs-json'; // 请替换为你的实际 Swagger API URL

/**
 * 生成 API 客户端的命令
 * @type {string}
 */
const generatorApiExec = `openapi-generator generate -i ./swagger.json -g typescript-axios -o ./src/api -t ${templateDir} --additional-properties=withSeparateModelsAndApi=true,apiPackage=api,modelPackage=models`;

/**
 * 下载 Swagger JSON 并生成 API 客户端
 * @returns {Promise<void>}
 */
async function generateApiClient(): Promise<void> {
  try {
    console.log('开始从 Swagger API 生成客户端...');
    console.log(`Swagger API URL: ${swaggerApiUrl}`);

    // // 确保目录存在
    // const swaggerDir = path.resolve(process.cwd(), 'swagger');
    // if (!fs.existsSync(swaggerDir)) {
    //   fs.mkdirSync(swaggerDir, { recursive: true });
    // }

    // 下载 Swagger JSON
    console.log('正在下载 Swagger JSON...');
    await downloadSwaggerJson(swaggerApiUrl);

    // 执行生成命令
    console.log('正在生成 API 客户端...');
    await executeGeneratorCommand(generatorApiExec);

    fs.unlinkSync(path.resolve(process.cwd(), "swagger.json"))

    console.log('API 客户端生成完成！');
  } catch (error) {
    console.error('生成 API 客户端时出错:', error);
    process.exit(1);
  }
}

// 导出函数，以便在 package.json 中调用
export default generateApiClient;

// 如果直接运行此文件，则执行生成
if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  generateApiClient();
}
