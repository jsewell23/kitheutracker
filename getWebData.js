const fetch = require("node-fetch")
module.exports = async (input) => {
    let email, id;
    try{
        email = input.slice(0,input.indexOf(":"))
        id = input.slice(input.indexOf(":")+1,input.length);
    }catch (e){
        return;
    }
    let dataProm = new Promise((resolve, reject) => {
        fetch(`https://web.global-e.com/order/TrackForm?ShippingEmail=${email}&OrderID=${id}`, {"method": "POST"}).then(
            (res) => res.text().then(
                (text) => {
                    resolve(text);
                }
            )
        )
    })
    return {"data": await dataProm, "email": email, "id": id};
}


