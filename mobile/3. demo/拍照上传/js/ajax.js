function ajax({
    async = true,
    data = '',
    type = 'GET',
    url,
    headers = { 'Content-Type': 'application/json' },
    contentType = true,
    onprogress,
    success,
    err
}) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                success(xhr.responseText);
            } else {
                err(xhr.responseText);
            }
        }
    }

    xhr.onprogress = function(e) {
        console.log(e);
    }

    let urlStr = data;

    if (type.toLowerCase() === 'get') {
        xhr.open('get', `${url}?${urlStr}`, async);
        xhr.send();
    }

    if (type.toLowerCase() === 'post') {
        xhr.open('post', url, async);

        if(contentType){
            for (let key in headers) {
                xhr.setRequestHeader(`${key}`, `${headers[key]}`);
            }
        }

        xhr.send(urlStr);
    }
}