declare module '@svgr/rollup' {
  interface SvgrOptions {
    svgo?: boolean;
    titleProp?: boolean;
    ref?: boolean;
  }
  interface SvgrRollupPluginOptions extends SvgrOptions {
    include?: string;
    exclude?: string;
    babel?: boolean;
  }

  declare function svgrPlugin(options?: SvgrRollupPluginOptions): Plugin;
  export default svgrPlugin;
}
