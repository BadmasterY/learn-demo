window.addEventListener('load', e => {
    let image = document.querySelector('img.image');
    let progress = document.querySelector('span.progress');
    let photo = document.querySelector('#photo');

    photo.addEventListener('change', e => {
        let files = e.target.files;

        if(files.length === 0) return; // 未上传文件,退出

        let file = files[0]; // 只取第一个文件

        uploadFile(file); // 上传文件
        readAsDataURL(file, image); // 预览图片

    }, false);

    function uploadFile(file) {
        let formData = new FormData(); // 构建 form data

        formData.append('image', file); // 将文件添加到 form data

        ajax({
            url: 'http://127.0.0.1:3000/upload',
            type: 'POST',
            data: formData,
            contentType: false, // 不设置头部信息,交给浏览器自行判断
            onprogress(xhr) {
                xhr.upload.onprogress = e => {
                    let percent = Math.floor(e.loaded / e.total * 100);
                    progress.innerText = percent + '%';
                }
            },
            success() {
                progress.innerText = '上传成功';
            },
            err(e){
                console.log(e);
                progress.innerText = '上传失败';
            }
        });
    }

    function readAsDataURL(file, image) {
        let reader = new FileReader(); // 使用 FileReader 读取文件,并转为 Data URL 格式
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            image.src = e.target.result;
            image.style.display = 'block';
        }
    }
}, false);