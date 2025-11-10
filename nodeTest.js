const express = require('express');
const app = express();
const PORT = 3005; // change to your assigned team port

app.get('/', (req, res) => {
    res.send('Hello express!');
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});