import {
  createConfigItem,
  loadPartialConfig,
  transformAsync,
} from "@babel/core";
import { transform } from "@svgr/core";
import { optimize } from "svgo";
import { promises as fs } from "fs";
import { getUrlForFile } from "snowpack";
import * as path from "path";
import * as mime from "mime";
import presetReact from "@babel/preset-react";
import presetEnv from "@babel/preset-env";
import pluginTransformReactConstantElements from "@babel/plugin-transform-react-constant-elements";

module.exports = function (_snowpackConfig, _pluginOptions) {
  return {
    name: "snowpack-svgr-plugin",
    resolve: {
      input: [".svg"],
      output: [".js", ".svg"],
    },
    async load({ filePath }) {
      const contents = await fs.readFile(filePath, "utf-8");

      const optimized = optimize(contents);

      const code = await transform(
        optimized.data,
        {
          icon: true,
          exportType: "named",
        },
        { componentName: "ReactComponent" }
      );

      const babelOptions = {
        filename: filePath,
        babelrc: false,
        configFile: false,
        presets: [
          createConfigItem(presetReact, { type: "preset" }),
          createConfigItem([presetEnv, { modules: false }], { type: "preset" }),
        ],
        plugins: [createConfigItem(pluginTransformReactConstantElements)],
      };

      const babelConfig = loadPartialConfig({
        filename: filePath,
        ...babelOptions,
      });

      const transformOptions = babelConfig?.options;

      const transformed = (await transformAsync(code, transformOptions)) || {};

      let result = transformed.code;

      const encodedUrl = await encode(filePath, filePath);

      const uri = encodedUrl
        ? encodedUrl
        : (getUrlForFile(filePath, _snowpackConfig) ?? "").replace(
            ".js",
            ".svg"
          );

      if (!uri) {
        console.error(`No url found for ${filePath}`);
      }

      result = result.replace(
        /export {.+};/,
        `export default "${uri}"; export { ReactComponent };`
      );

      return {
        ".js": result,
        ".svg": await fs.readFile(filePath),
      };
    },
  };
};

const encode = async (file: string, name: string) => {
  const encoding = "binary";
  if (path.isAbsolute(file)) {
    file = await fs.readFile(file, encoding);
  }

  if (file.length > 10240) {
    return;
  }

  const mimetype = mime.getType(name);
  const buffer = Buffer.from(file, encoding);
  return `data:${mimetype || ""};base64,${buffer.toString("base64")}`;
};
