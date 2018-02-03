/**
 * Created by SYLVAIN on 02/02/2018.
 */


function hello(str) {
    if(typeof str !== 'string'){
        return "err"
    }else{
        return "ok"
    }
}

module.exports = hello;