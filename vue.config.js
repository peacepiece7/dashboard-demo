const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    publicPath: "/support",
    devServer: {

        open: true,
        port: 8080
    },
    transpileDependencies: true,
    // 린트제거
    lintOnSave: false,
    css: {
        loaderOptions: {
            scss: {
                additionalData: `
                    @import "@/style/_variable.scss";
			        @import "@/style/mixins/_mixin.scss";
                `
            }
        }
    }
});
