const jwt = require('jsonwebtoken')

const requireAuth = function(redirPath) {
    return async (req, res, next) => {
        const token = req.cookies.jwt;

        //check jwt exists and is verified
        if (token) {
            jwt.verify(token, 'f6264014d8c8b3d7923de0087777bc38', (err, decodedToken) => {
                if (err) {
                    console.log(err.message);
                    res.cookie("context", `${req.url}`, { httpOnly: true, maxAge: 10000 })
                    res.redirect(redirPath);

                } else {
                    console.log(decodedToken);
                    next();
                }
            })

        } else {

            console.log(redirPath)
            res.cookie("context", `${req.url}`, { httpOnly: true, maxAge: 20000 })
            res.redirect(redirPath);


        }
    }
}

module.exports = { requireAuth };
