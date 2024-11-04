class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields"];
    excludesFields.forEach((field) => delete queryStringObj[field]);
    
    // Apply filtration using relevant fields
    let queryStr = JSON.stringify(queryStringObj);
    
    // You can customize the following conditions based on your requirements
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // Sort by date or any other relevant field
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("date"); // Default to sorting by date
    }
    return this;
  }

  limitFields() {
    // Limit fields that can be returned in the response
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v"); // Exclude version field by default
    }
    return this;
  }

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50; // Default limit
    const skip = (page - 1) * limit;

    // Pagination result
    const pagination = {
      currentPage: page,
      limit: limit,
      numberOfPages: Math.ceil(countDocuments / limit)
    };

    // Handle next and previous pages
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    if (page * limit < countDocuments) {
      pagination.next = page + 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }
}

module.exports = ApiFeatures;
