import jwt from 'jsonwebtoken';

const generateTokenAndSetCoookie = (userId, res) => {

    // creating token by userId and jwt-secret-key 
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "15d",
    })

    //set cookie by random text like "jwt" below given and including token 
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //milliseconds
        httpOnly: true, //prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", //prevent CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    })

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    

    // return {token};

}

export default generateTokenAndSetCoookie;