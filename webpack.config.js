const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => { 
  const isDevelopment = argv.mode === 'development'; 

  return {
    
    // mode: isDevelopment ? 'development' : 'production',
    mode: 'development',

    entry: './script.js', 
    output: {
      
      path: path.resolve(__dirname, 'dist'),     
      // filename: isDevelopment ? 'bundle.js' : 'bundle.[contenthash].js',    
      filename: 'bundle.[contenthash].js',      

      clean: true,
      // publicPath: '',
      // assetModuleFilename: 'assets/[name][ext][query]', 
    },

    module: {
      rules: [
        // Правило для CSS-файлов
        {
          test: /\.css$/i, 
          use: [
            // MiniCssExtractPlugin.loader,

            // isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            "style-loader",
            
            'css-loader',
          ],
        },

        // {
        //   test: /\.(png|svg|jpg|jpeg|gif)$/i, 
        //   type: 'asset/resource', 
                                  
        // },
      ],
    },

    
    plugins: [
      
      new HtmlWebpackPlugin({
        template: './public/index.html', 
        // filename: 'index.html',   
      }),
      new MiniCssExtractPlugin({
        filename: "./main.css"
      }),
      // !isDevelopment && new MiniCssExtractPlugin({
      //   filename: 'styles/[name].[contenthash].css',
      // }),
    // ].filter(Boolean), 
    ],
                       

   
    devServer: {
      // static: path.resolve(__dirname, 'dist'), 
      port: 8080,                 
      open: true,                 
      hot: true,
      historyApiFallback: true  ,                
                                 
    },
  };
};
