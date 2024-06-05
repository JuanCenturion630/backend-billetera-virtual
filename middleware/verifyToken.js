const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifyToken = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization || "";

    if (!authorizationHeader) {
        res.status(401).send("No autorizado.");
    }

    const token = authorizationHeader.replace("Bearer ", "");

    const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.USER_POOL_ID,
        tokenUse: process.env.TOKEN_USE,
        clientId: process.env.CLIENT_ID,
    });

    try {
        await verifier.verify(token).then(()=> {
            next();
        }).catch((err)=> {
            res.status(401).send("No autorizado.");
        });
    } catch {
        res.status(401).send("No autorizado.");
    }
};

module.exports = verifyToken;