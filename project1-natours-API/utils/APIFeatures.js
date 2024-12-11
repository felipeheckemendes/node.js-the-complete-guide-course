module.exports = class APIFeatures {
  constructor(query, querySpec) {
    this.query = query;
    this.querySpec = querySpec;
  }

  filter() {
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.querySpec };
    excludedFields.forEach((element) => delete queryObj[element]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.querySpec.sort) {
      const sortBy = this.querySpec.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt _id');
    }
    return this;
  }

  limit() {
    if (this.querySpec.fields) {
      const selectedFields = this.querySpec.fields.split(',').join(' ');
      this.query = this.query.select(selectedFields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = parseInt(this.querySpec.page, 10) || 1;
    const limit = parseInt(this.querySpec.limit, 10) || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
};
