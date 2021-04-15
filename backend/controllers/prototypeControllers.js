const Prototype = require("../models/Prototype");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

exports.getAllPrototypes = asyncHandler(async (req, res, next) => {
  let query;

  let uiValues = {
    filtering: {},
    sorting: {},
  };

  const reqQuery = { ...req.query };
  const removeFields = ["sort"];

  removeFields.forEach((val) => delete reqQuery[val]);

  const filterKeys = Object.keys(reqQuery);
  const filterValues = Object.values(reqQuery);

  filterKeys.forEach(
    (val, idx) => (uiValues.filtering[val] = filterValues[idx])
  );

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // sort
  let mongoQuery = JSON.parse(queryStr);
  if (mongoQuery["price"]) {
    mongoQuery["price"]["$gte"] = parseInt(mongoQuery["price"]["$gte"]);
    mongoQuery["price"]["$lte"] = parseInt(mongoQuery["price"]["$lte"]);
  }
  query = Prototype.find(mongoQuery);

  if (req.query.sort) {
    const sortByArr = req.query.sort.split(",");

    sortByArr.forEach((val) => {
      let order;
      if (val[0] === "-") {
        order = "descending";
      } else {
        order = "ascending";
      }

      uiValues.sorting[order.replace("-", "")] = order;
    });

    const sortByStr = sortByArr.join(" ");

    query = query.sort(sortByStr);
  } else {
    query = query.sort("-price");
  }

  // filter
  const prototypes = await query;

  const maxPrice = await Prototype.find()
    .sort({ price: -1 })
    .limit(1)
    .select("-_id price");

  const minPrice = await Prototype.find()
    .sort({ price: 1 })
    .limit(1)
    .select("-_id price");

  uiValues.maxPrice = maxPrice[0].price;
  uiValues.minPrice = minPrice[0].price;

  res.status(200).json({
    success: true,
    data: prototypes,
    uiValues,
  });
});

exports.createNewPrototype = asyncHandler(async (req, res, next) => {
  const practice = {
    ...req.body,
    price: parseInt(req.body.price),
  };
  const prototype = await Prototype.create(practice);
  res.status(201).json({
    success: true,
    data: prototype,
  });
});

exports.updatePrototypeById = asyncHandler(async (req, res, next) => {
  let prototype = await Prototype.findById(req.params.id);

  if (!prototype) {
    return next(new ErrorResponse(`with id ${req.params.id}`, 404));
  }

  prototype = await Prototype.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: prototype,
  });
});

exports.deletePrototypeById = asyncHandler(async (req, res, next) => {
  let prototype = await Prototype.findById(req.params.id);

  if (!prototype) {
    return next(new ErrorResponse(`with id ${req.params.id}`, 404));
  }

  await prototype.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
