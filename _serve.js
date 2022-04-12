const express = require('express');
const app = express();

const fs = require('fs');

app.use('/rdb', express.static(__dirname));
app.get('*', (req, res) => {
    let raw = fs.readFileSync(`${__dirname}/find.html`);
    let text = raw.toString();
    let lines = text.split('\n');
    lines.splice(0,3);
    text = lines.join('\n');
    res.setHeader('type', 'content/html');
    res.send(text);
});

app.listen(8080, (e) => {
    if(e) throw e;
    console.log('running on port 8080')
});