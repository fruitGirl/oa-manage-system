const fs = require('fs');
// 多入口配置
const readFileList = function (path, filesList) {
    let files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        let stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            //递归读取文件
            readFileList(path + itm + "/", filesList)
        } else {

            let obj = {};//定义一个对象存放文件的路径和名字
            obj.path = path;//路径
            obj.filename = itm//名字
            filesList.push(obj);
        }

    })
}
const getFileList = function (path) {
    let filesList = [];
    readFileList(path, filesList);
    return filesList;
}
module.exports = getFileList;
