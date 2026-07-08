// server/utils/apiFeatures.js
// Query builder for search, filter, sort, and pagination

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Text search
  search(categoryIds = []) {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            { name: { $regex: this.queryStr.keyword, $options: 'i' } },
            { description: { $regex: this.queryStr.keyword, $options: 'i' } },
            { brand: { $regex: this.queryStr.keyword, $options: 'i' } },
            { tags: { $regex: this.queryStr.keyword, $options: 'i' } },
            ...(categoryIds && categoryIds.length > 0 ? [{ category: { $in: categoryIds } }] : []),
          ],
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Filter by category, price range, rating
  filter() {
    const queryCopy = { ...this.queryStr };

    // Remove fields that are not filters
    const removeFields = ['keyword', 'page', 'limit', 'sort', 'fields'];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Handle category filter
    if (queryCopy.category) {
      queryCopy.category = queryCopy.category;
    }

    // Handle price range
    if (queryCopy.minPrice || queryCopy.maxPrice) {
      queryCopy.price = {};
      if (queryCopy.minPrice) {
        queryCopy.price.$gte = Number(queryCopy.minPrice);
        delete queryCopy.minPrice;
      }
      if (queryCopy.maxPrice) {
        queryCopy.price.$lte = Number(queryCopy.maxPrice);
        delete queryCopy.maxPrice;
      }
    }

    // Handle rating filter
    if (queryCopy.rating) {
      queryCopy.rating = { $gte: Number(queryCopy.rating) };
    }

    this.query = this.query.find(queryCopy);
    return this;
  }

  // Sort results
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // Paginate results
  paginate() {
    const page = parseInt(this.queryStr.page, 10) || 1;
    const limit = parseInt(this.queryStr.limit, 10) || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }

  // Select specific fields
  selectFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }
}

module.exports = ApiFeatures;
