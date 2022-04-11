let path = window.location.pathname.split('/');
path.splice(0,2);

function imports(text) {
    let lines = text.split('\n');
    if(lines[0].includes('<!--') && !lines[0].includes('-->')) {
        lines.splice(0,1);
        for(let i = 0; i < lines.length; i++) {
            if(lines[i].includes('-->')) break;
            let words = lines[i].split(' ');
            console.log(lines[i])
            if(words[0].toUpperCase() == '#IMPORTS' && words[2].toLowerCase() != 'x') {
                // console.log('check 1')
                if(words[1].toUpperCase() == 'SCRIPT') {
                    // console.log('check 2.1')
                    document.head.innerHTML+=`<link rel="stylesheet" href="${words[2]}" type="text/css">`
                }
                else if(words[1].toUpperCase() == 'STYLE') {
                    // console.log('check 2.2')
                    document.head.innerHTML+=`<script src="${words[2]}" defer></script>`
                }
            }
        }
    }
}

async function getTemplate(file, next) {
    await fetch(`/rdb/templates/${file}.html`)
        .then(res => res.text())
        .then(text => next(text, null))
        .catch(err => next(null, err));
}

async function template(file, opts, next){  
    await getTemplate(file, async (content, err) => {
        if(err) console.error(err);
        else {
            imports(content);
            let newContent = content.replace(/{{.*?}}/g, 
                function(match){
                    match = match.replace('{{', '');
                    match = match.replace('}}', '');
                    console.log(match);
                    return opts[match]
                });
            next(newContent);
        }
    });
}

(async function() {
    if(path[0] == 'engines') {
        await fetch(window.location.pathname + '.json').then(res => res.json())
            .then(async json => {
                await template('engine', json, content => {
                    document.getElementById('root').innerHTML = content;
                })
            }).catch(e => {
                console.error('errorrr: ', e);
                console.log(path);
            })
    } else {
        console.error('L bad... not engines: ', path);
    }
})();