const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    // Create request query
    let reqQuery = {...req.query};
    console.log("before reqQuery is: ", reqQuery);

    // Field to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    console.log("After reqQuery is: ", reqQuery);

    // Create query string
    let queryStr = JSON.stringify(req.query);
    // Create Operator ($gt, $gte, $lt, $lte)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    console.log("query string is: ", queryStr);
    console.log("after parse: ", JSON.parse(queryStr) )
    // Find Bootcamp
    query = model.find(JSON.parse(queryStr)); 
    // Select Fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    // Sort Fields
    console.log(req.query.sort)
    if (req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    }else{
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25; // by default limit is 25
    const startIndex = (page - 1) * limit; // limitize first total
    const endIndex = page * limit;
    const total = await model.countDocuments(); // total is all the records in the database

    query = query.skip(startIndex).limit(limit);

    if (populate){
        query = query.populate(populate);
    }

    // Executing Query
    const results = await query;

    //Pagination Result
    const pagination = {}
    //if there are some records are remaining to show then it will show next page counter
    if (endIndex < total){
        pagination.next = {
            page: page + 1,
            limit // when key and value are same then we dont need to do this
        }
    }
    // if there are some records which are skipped at start
    if (startIndex > 0 ){
        pagination.prev = {
            page: page - 1,
            limit // when key and value are same then we dont need to do this
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
} 
module.exports = advancedResults;