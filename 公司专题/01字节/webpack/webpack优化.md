## webpack 优化

#### 区分 dev & prod 配置

- publicPath
- baseUrl

```
new webpack.DefinePlugin({
  mode: JSON.stringfy(MODE)
}),
```

#### 指定 loader & plugin 的 exclude、include 范围
#### alias

#### 多线程

- loader 多线程 ： HappyPack
- plugin 多线程 ： UglifyWebpackPlugin、TerserPlugin、

#### 第三方包关系映射

使用 DllPlugin 生成包映射， 开发环境使用 DllReferencePlugin ，不需要重复编译第三方包

#### minimize & tree shaking

- 使用支持 esModule 的第三方
- 关闭不常用的配置，指定压缩范围

```
new UglifyWebpackPlugin({
    parallel: true,
    cache: true,
    uglifyOptions: {
        compress: {
            warnings: false,
            drop_console: true,
            pure_funcs: ['console.log'],
            booleans: false,
            collapse_vars: false,
            comparisons: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            if_return: false,
            inline: false,
            join_vars: false,
            keep_infinity: true,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            sequences: false,
            side_effects: false,
            switches: false,
            top_retain: false,
            toplevel: false,
            typeofs: false,
            unused: false,

            // 除非声明了正在使用生产版本的react-devtools，
            // 否则关闭所有类型的压缩。
            conditionals: true,
            dead_code: true,
            evaluate: true,
        },
        mangle: true,
    },
    sourceMap: true,
    chunkFilter: (chunk)=>{
        if(chunk.name==='vendor'){
             return false
        }
        return true
    }
}),
```

#### 提取的 css 文件使用 contenthash

### runtime 环境代码提取


#### 合理的拆包策略

- chunk-initial 基础类库
- chunk-common 公共方法/组件
- chunk-ui UI 库
- chunk-others 低频使用的组件
- main 业务代码

<!-- ### inline-manifest-webpack-plugin -->

### nodemon 修改配置文件自动重启
