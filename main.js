function httpGet(url) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (this.status == 200) {
                resolve(this.response);
            } else {
                let error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };
        xhr.onerror = function() {
            reject(new Error("Network Error"));
        };
        xhr.send();
    });
}

httpGet('http://jsonplaceholder.typicode.com/users').then(function (value) {

    function getData(value) {
        if (localStorage.getItem('data') !== null) {
            return  JSON.parse(localStorage.getItem('data'))
        }else {
            return JSON.parse(value);
        }
    }

    let data = getData(value);

    data.renderTable = function () {
        let html = '';
        let temp = '<tr>';

        Object.keys(this[0]).forEach(item => {
            if (typeof this[0][item] != 'object') {
                if (location.href.split('?').pop() === `${item}-ASC.html`) {
                    temp += `<th type = 'ASC'>${item}</th>`
                } else if (location.href.split('?').pop() === `${item}-DESC.html`) {
                    temp += `<th type = 'DESC'>${item}</th>`
                } else {
                    temp += `<th>${item}</th>`
                }
            }
        });

        temp += '</tr>';
        html += temp;

        this.forEach(function (obj) {
            temp = '';
            for (let key in obj) {
                if (typeof obj[key] != 'object') {
                    temp += `<td>${obj[key]}</td>`
                }
            }
            html += `<tr>${temp}</tr>`;
        });

        document.querySelector('section').innerHTML = `<table border="1">${html}</table>`;

        document.querySelector('tr').addEventListener('click', function (event) {
            let target = event.target;
            let keyName = target.innerHTML;
            if (target.tagName === 'TH' && location.href.split('?').pop() === `${keyName}-ASC.html`) {
                data.sort(function (a, b) {
                    if (a[keyName] < b[keyName]) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                history.pushState({}, '', `?${keyName}-DESC.html`);
                data.renderTable();
            } else if (target.tagName === 'TH') {
                data.sort(function (a, b) {
                    if (a[keyName] > b[keyName]) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                history.pushState({}, '', `?${keyName}-ASC.html`);
                data.renderTable();
            }
        });

        document.querySelectorAll('td').forEach(function (item) {
            item.addEventListener('dblclick', function (event) {
                let target = event.target;
                let keyName = document.elementFromPoint(target.offsetLeft, 15).innerHTML;
                console.log(keyName);
                let currentIndex = document.elementFromPoint(15, target.offsetTop).innerHTML;
                console.log(currentIndex);
                if (target.tagName === 'TD') {
                    let input = document.createElement("input");
                    target.appendChild(input);
                    const nodeInput = target.querySelector("input");
                    nodeInput.focus();
                    nodeInput.addEventListener('keyup', function (event) {
                         if (event.keyCode === 13) {
                             data.forEach(function (item) {
                                if (item['id'] == currentIndex) {
                                    item[keyName] = nodeInput.value
                                }
                             });
                             nodeInput.remove();
                             data.renderTable();
                             localStorage.setItem('data', JSON.stringify(data))
                         }
                    });
                }
            })
        });
    };


    data.renderTable();

    window.onpopstate = function () {
        let regular = '\\?(.*?)-';
        if (location.href.match(regular)) {
            let keyName = location.href.match(regular)[1];
            if (location.href.split('-').pop() === 'ASC.html') {
                data.sort(function (a, b) {
                    if (a[keyName] < b[keyName]) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                data.renderTable();
            } else if (location.href.split('-').pop() === 'DESC.html') {
                data.sort(function (a, b) {
                    if (a[keyName] > b[keyName]) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                data.renderTable();
            }
        } else {
            data.sort(function (a, b) {
                if (a['id'] > b['id']) {
                    return 1;
                } else {
                    return -1;
                }
            });
            data.renderTable();
        }
    };

});



















