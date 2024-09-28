const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');
const app = express();

const port = process.env.PORT || 8080;

const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE || 'https://steelhacks/api',
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-7gckygndw70vws1i.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

app.use(jwtCheck);

app.get('/authorized', (req, res) => {
    res.send('Secured Resource');
});

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid token');
    } else {
        next(err);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

console.log('Running on port ', port);
