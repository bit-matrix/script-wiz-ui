require("babel-register")({
    presets: ["es2015", "react"]
});
const router = require("./sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;

const generateSitemap = () => {
    return(
        new Sitemap(router)
            .build("https://google-seo.d2x3f0fid379b7.amplifyapp.com/")
            .save("./public/sitemap.xml")
    );
}

generateSitemap();