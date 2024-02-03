class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    // 1 - filtering
    const filterQueryObj = { ...this.queryString };
    const excludeFields = [
      "limit",
      "page",
      "sort",
      "search",
      "fields",
      "keyWord",
    ];
    excludeFields.forEach((fields) => delete filterQueryObj[fields]);
    let filterString = JSON.stringify(filterQueryObj);
    filterString = filterString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(filterString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      console.log(this.queryString.sort);
      let sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      let selectBy = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(selectBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyWord) {
      let query = {};
      if (modelName === "Product") {
        query.$or = [
          { title: { $regex: this.queryString.keyWord, $options: "i" } },
          { description: { $regex: this.queryString.keyWord, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyWord, $options: "i" } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  pagination(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const paginationResult = {};
    paginationResult.currantPage = page;
    paginationResult.limit = limit;
    paginationResult.numberOfPage = Math.ceil(countDocuments / limit);

    if (endIndex < countDocuments) {
      paginationResult.next = page + 1;
    }
    if (skip > 0) {
      paginationResult.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = paginationResult;
    return this;
  }
}

module.exports = ApiFeatures;
