module.exports = (check) => (req, res, next) =>{
    Promise.resolve(check(req, res, next)).catch((e)=>{
        res.send({
            success: false,
            message: e.message
        })
    })
}