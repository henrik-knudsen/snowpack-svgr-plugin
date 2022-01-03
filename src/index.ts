import {
  createConfigItem,
  loadPartialConfig,
  transformAsync,
} from "@babel/core";
import { transform } from "@svgr/core";
import { promises as fs } from "fs";
import presetReact from "@babel/preset-react";
import presetEnv from "@babel/preset-env";
import pluginTransformReactConstantElements from "@babel/plugin-transform-react-constant-elements";

module.exports = function (_snowpackConfig, _pluginOptions) {
  return {
    name: "snowpack-svgr-plugin",
    resolve: {
      input: [".svg"],
      output: [".js"],
    },
    async load({ filePath }) {
      const contents = await fs.readFile(filePath, "utf-8");

      const code = await transform(
        contents,
        {
          icon: true,
          exportType: "named",
          svgo: true,
          plugins: ["@svgr/plugin-svgo"],
        },
        { componentName: "ReactComponent" }
      );

      const babelOptions = {
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

      const result = (await transformAsync(code, transformOptions)) || {};
      return result.code;
    },
  };
};
