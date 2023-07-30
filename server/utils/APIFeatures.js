class APIFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const hai = { ...this.queryString };
    const avoidable = ["page", "sort", "fields", "limit"];
    avoidable.forEach((el) => {
      delete hai[el];
    });
    this.query.find(hai);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query.sort(sortBy);
    } else {
      this.query.sort("-createdAt");
    }
    return this;
  }
  limit() {
    if (this.queryString.fields) {
      const fieldsBy = this.queryString.fields.split(",").join(" ");
      this.query.select(fieldsBy);
    }
    return this;
  }
  pagenation() {
    if (this.queryString.page) {
      const page = this.queryString.page * 1;
      const limit = this.queryString.limit * 1;
      const skip = (page - 1) * limit;

      this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = APIFeature;
