function switchMes(elem, self) {
    elem.classList.toggle('imp');
    elem.classList.toggle('met');
    if(self && elem.classList.contains('imp')) {
        self.innerText = 'Switch to metric measurements';
    } else if(elem.classList.contains('met')) {
        self.innerText = 'Switch to imperial measurements';
    }
}

document.getElementById('nav_engines').classList.toggle('active');