import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(jwt.decode(token));
        const decodedTocken = jwt.verify(token, process.env.HMS_SECRET_APP);
        const { uid, name, photoURL, email, mid } = decodedTocken;
        const username = email.split('@')[0];
        req.user = { uid, name, photoURL, email, username, mid };
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message:
                'Something is wrong with your authorization, please sign in again.',
        });
    }
};

export default auth;
