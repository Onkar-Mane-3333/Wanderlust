// function wrapAsync(fn){
//     return function(req,tes,next) {
//         fn(req,res,next).catch(next);
//     }
// }

// we can export directly
module.exports = (fn) => {
    return (req,res,next) => {
        fn(req,res,next).catch(next);
    }
}