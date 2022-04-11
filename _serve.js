const express = require('express');
const app = express();

app.use('/rdb', express.static(__dirname));
app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/find.html`);
});

app.listen(8080, (e) => {
    if(e) throw e;
    console.log('running on port 8080')
});