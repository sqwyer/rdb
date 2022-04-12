(async function() {
    await fetch('/rdb/engines/list.json')
        .then(res => res.json())
        .then(json => {
            let root = document.getElementById('root');
            for(let key in json) {
                root.innerHTML += '<br />';
                let table = document.createElement('table');
                table.innerHTML += `<tr><th>${key}</th></tr>`;
                for(let i = 0; i < json[key].length; i++) {
                    table.innerHTML += `<tr><td><a href="/rdb/engines/${json[key][i].path}">${json[key][i].name}</a></td></tr>`;
                }
                root.appendChild(table);
                // root.innerHTML += '<br />';
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById('root').innerText = 'An error occured loading engines...';
        })
}());