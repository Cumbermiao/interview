
module.exports = {
    mode:'development',
    devtool:'inline-source-map',
    devServer:{
        contentBase:'../dist',
        host: '0.0.0.0',
        useLocalIp:true,
        port:'3000',
        historyApiFallback: {
            // rewrites: [
            //   { from: /^\/credit.*/, to: '/credit/index.html' },
            // ]
        }
    }
}