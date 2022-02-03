const handleDuplicateKeyError = (err, res) => {
    const field = Object.keys(err.keyValue);
    const error = `${field} debe ser únic@`;
    res.status(409).send({messages: error});
 }
 const handleValidationError = (err, res) => {
    let errors = Object.values(err.errors).map(el => el.message);
    if(errors.length > 1) {
        let chain = "";
        for (let i = 0; i < errs.length; i++) {
          chain += errors[i] + " || ";
        }
        const string = chain.slice(0, -4);
        res.status(400).send({messages: string});
    } else {
        res.status(400).send({messages: errors});
    }
 }

const typeError = (err, req, res, next) => {
    const errOrigin = err.origin
    try {
            if(err.name === 'ValidationError') return err = handleValidationError(err, res);
            if(err.code && err.code == 11000) return err = handleDuplicateKeyError(err, res);
            
    } catch(err) {
           res.status(500).send('Hubo un problema a la hora de crear un Post');
    }
    }

module.exports = { typeError }