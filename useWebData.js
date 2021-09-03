const cheerio = require("cheerio")

module.exports = (data) => {
    let $, status, trackingURL, imgurl, product;
    try{
        data = data.toString();
    }
    catch (e){
        return;
    }
    if(data.includes("Sorry")){
        return 1;
    }
    try{
        $ = cheerio.load(data);
        status = $(".current").text().trim().substring(3);
        trackingURL = $("a")[0].attribs.href;
        imgurl = $("img")[0].attribs.src;
        product = $(".product-name").text().trim();
    }catch (e){
        return;
    }
    return({
        "status": status,
        "tracking": trackingURL,
        "img": imgurl,
        "product": product,
        "cancelled": data.includes("Cancelled")
    })


}
