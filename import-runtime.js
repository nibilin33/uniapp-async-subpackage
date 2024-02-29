const { ReplaceSource } = require("webpack-sources");

const getSourceAsString = (source) => {
  let content = source.source();
  if (Buffer.isBuffer(content)) {
    content = content.toString();
  }
  return content;
};

const relativeThunkPath = (curThunkId, targetThunkId) => {
  const parentDirCount = `${curThunkId}`.split("/").length - 1;
  let relPrefix = "";
  for (let i = 0; i < parentDirCount; i += 1) {
    relPrefix += "../";
  }
  return `${relPrefix + targetThunkId}.js`;
};

class MpImportRuntimeTemplatePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      { name: "MpImportRuntimeTemplatePlugin" },
      (compilation) => {
        compilation.hooks.optimizeChunkAssets.tapAsync(
          { name: "MpImportRuntimeTemplatePlugin", stage: -1 },
          (chunks, callback) =>
            this.optimizeChunkAssetsFn(compilation, chunks, callback)
        );
      }
    );
  }
  // 处理import(),替换成require.async, 需要再tester前，import 会被处理成__webpack_require__.e
  optimizeChunkAssetsFn(compilation, chunks, callback) {
    Array.from(chunks)
      .reduce((acc, chunk) => acc.concat(chunk.files || []), [])
      .concat(compilation.additionalChunkAssets || [])
      .filter((file) => `${file}`.endsWith(".js"))
      .forEach((assetName) => {
        try {
          const oldSource = compilation.assets[assetName];
          let oldContent = getSourceAsString(oldSource);
          console.log(oldContent.indexOf("__webpack_require__.e"));
          if (oldContent.indexOf("__webpack_require__.e") !== -1) {
            const newSourceAsync = new ReplaceSource(oldSource);
            const regexAsync =
              /(?<requireAsync>__webpack_require__.e)\((?<comment>\/\*.+?\*\/\s?)?"(?<thunkId>.+?)"\)/dg;

            for (const res of oldContent.matchAll(regexAsync)) {
              const { indices, groups } = res;
              const {
                requireAsync: requireAsyncIndices,
                thunkId: thunkIdIndices,
              } = indices.groups;
              const { thunkId } = groups;
              console.log(thunkId,"fuckk")
              if (!thunkId) {
                throw new Error(`missing thunkId in "${thunkId}"`);
              }

              const thunkPath = relativeThunkPath(assetName, thunkId);

              newSourceAsync.replace(
                requireAsyncIndices[0],
                requireAsyncIndices[1] - 1,
                "require.async"
              );
              newSourceAsync.replace(
                thunkIdIndices[0],
                thunkIdIndices[1] - 1,
                thunkPath
              );
            }
            compilation.updateAsset(assetName, newSourceAsync);
          }
        } catch (e) {
          compilation.errors.push(e);
        }
      });

    callback();
  }
}

module.exports = MpImportRuntimeTemplatePlugin;
