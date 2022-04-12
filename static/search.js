let path = window.location.pathname.split('/');
path.splice(0,2);


// cred: https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arrays-by-string-path
// function byString(o, s) {
//     s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
//     s = s.replace(/^\./, '');           // strip a leading dot
//     var a = s.split('.');
//     for (var i = 0, n = a.length; i < n; ++i) {
//         var k = a[i];
//         if (k in o) {
//             o = o[k];
//         } else {
//             return;
//         }
//     }
//     return o;
// }

function resolve(path, obj=self, separator='.') {
    var properties = Array.isArray(path) ? path : path.split(separator)
    return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

// end cred

function imports(text) {
    let lines = text.split('\n');
    if(lines[0].includes('<!--') && !lines[0].includes('-->')) {
        lines.splice(0,1);
        for(let i = 0; i < lines.length; i++) {
            if(lines[i].includes('-->')) break;
            let words = lines[i].split(' ');
            if(words[0].toUpperCase() === '#IMPORTS' && words[2].toLowerCase().trim() != 'x') {
                if(words[1].toUpperCase() == 'SCRIPT') {
                    let link = document.createElement('script');
                    link.src = `${words[2]}`;
                    document.querySelector('body').appendChild(link);
                }
                else if(words[1].toUpperCase() == 'STYLE') {
                    document.querySelector('head').innerHTML+=`<link rel="stylesheet" href="${words[2]}" type="text/css">`
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
                    console.log(match, opts, resolve(match, opts));
                    // console.log(match);
                    // return byString(opts, match);
                    return resolve(match, opts);
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
                console.error('Error: ', e);
                // console.log(path);
            })
    } else {
        console.error('No engine at path: ', path);
    }
})();