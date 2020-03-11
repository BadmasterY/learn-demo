const http = require('http');
const server = http.Server();
const httpConfig = require('config').get('http');
const { host, port } = httpConfig;
const { Tests } = require('./db/Model');
const { Dao } = require('./db/Dao');

server.listen(httpConfig, () => {
    console.log(`[Http] server run at: http://${host}:${port}...`);
});

const test = new Dao(Tests);
let id = '';

test.save({ name: 'BadmasterY', nickname: 'Mr.' })
    .then(res => {
        id = res._id;
        console.log(`${id} save is ok!`);
        test.updateOne({ _id: id }, { name: 'yu' })
            .then(res => {
                console.log(res);
                test.deleteOne({ _id: id })
                    .then(res => {
                        console.log(res);
                    }).catch(err => console.log(err));
            }).catch(err => console.log(err));
    })
    .catch(err => console.log(err));