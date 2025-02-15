import { paginationFunction } from "./pagination.js"


export class APIFeatures {
    // mongooseQuery  = model.find()
    // query = req.query
    constructor(query, mongooseQuery) {
        this.query = query // we can remove this variable becaue we didn't use it
        this.mongooseQuery = mongooseQuery
    }

    pagination({ page, size }) {
        const { limit, skip } = paginationFunction({ page, size })  //{limit: 2, skip: 0}
        // console.log({ limit, skip });
        this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)  // mongoose query
        return this
    }

    sort(sortBy) {
        if (!sortBy) {
            this.mongooseQuery = this.mongooseQuery.sort({ createdAt: -1 })
            return this
        }
        const formula = sortBy.replace(/desc/g, -1).replace(/asc/g, 1).replace(/ /g, ':') // 'stock  desc' => 'stock: -1'
        const [key, value] = formula.split(':')

        this.mongooseQuery = this.mongooseQuery.sort({ [key]: +value })
        return this
    }

    search(search) {
        const queryFiler = {}

        if (search.title) queryFiler.title = { $regex: search.title, $options: 'i' }
        if (search.desc) queryFiler.desc = { $regex: search.desc, $options: 'i' }
        if (search.discount) queryFiler.discount = { $ne: 0 }
        if (search.priceFrom && !search.priceTo) queryFiler.appliedPrice = { $gte: search.priceFrom }
        if (search.priceTo && !search.priceFrom) queryFiler.appliedPrice = { $lte: search.priceTo }
        if (search.priceTo && search.priceFrom) queryFiler.appliedPrice = { $gte: search.priceFrom, $lte: search.priceTo }

        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }

    filters(filters) {

        /**
         * the filters will contian data like this
         * @params will be in this formate
            appliedPrice[gte]=100 
            stock[lte]=200
            discount[ne]=0
            title[regex]=iphone
        */
        const queryFilter = JSON.parse(
            JSON.stringify(filters).replace(
                /gt|gte|lt|lte|in|nin|eq|ne|regex/g,
                (operator) => `$${operator}`,
            ),
        )

        /**
         * @object will be like this after the replace method
         * { appliedPrice: { $gte: 100 }, stock: { $lte: 200 }, discount: { $ne: 0 }, title: { $regex: 'iphone' } 
         */
        this.mongooseQuery.find(queryFilter)
        return this
    }
}