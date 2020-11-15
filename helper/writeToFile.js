const jsonfile = require('jsonfile');

const file = './userdata.json';

exports.writeFileAsync = (obj) => {
    return new Promise(function(resolve, reject) {
        var dataFromObject = {
            table: []
        };
        dataFromObject.table.push(obj);

        console.log('inside write json');

        // checking if file exists
        jsonfile.readFile(file, (err, data) => {
            // if not create a new file
            if(err && err.code === 'ENOENT') {
                jsonfile.writeFile(file, dataFromObject, (err) => {
                    if(err) console.log(err);
                    else console.log("written");
                });
            }
            else if(err) {
                console.log(err);
            }
            // if exists, push data!
            else {
                data.table.push(obj);
                jsonfile.writeFile(file, data, (err) => {
                    if(err) console.log(err);
                    else console.log("pushed data");
                });
            }
        });

        resolve('Written to File');

    });
};
