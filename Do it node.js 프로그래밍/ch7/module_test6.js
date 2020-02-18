var require = function(path){
    let exports = {};
    exports.getUser=()=>{
            return {id:'testM',name:'ModuleT'};
        };
        exports.group={
            id:'group01',
            name:'cccc'
        }
        return exports;
    };

let user = require('...');

function showUser(){
    return user.getUser().name+' , '+user.group.name;
}
console.log(showUser());