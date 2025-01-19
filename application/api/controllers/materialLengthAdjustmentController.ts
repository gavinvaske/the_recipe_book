import { Router, Request, Response } from 'express';
const router = Router();
import { CREATED_SUCCESSFULLY, SERVER_ERROR, SUCCESS } from '../enums/httpStatusCodes.ts';
import { verifyBearerToken } from '../middleware/authorize.ts';
import { IMaterialLengthAdjustment, MaterialLengthAdjustmentModel } from '../models/materialLengthAdjustment.ts';
import { DESCENDING } from '../enums/mongooseSortMethods.ts';
import { SearchQuery, SearchResult } from '../../_types/shared/http.ts';
import { DEFAULT_SORT_OPTIONS } from '../constants/express.ts';
import { SortOption } from '../../_types/api/mongoose.ts';

router.use(verifyBearerToken);

router.post('/', async (request: Request, response: Response) => {
    try {
        const savedMaterialLengthAdjustment = await MaterialLengthAdjustmentModel.create(request.body);

        return response
            .status(CREATED_SUCCESSFULLY)
            .send(savedMaterialLengthAdjustment);
    } catch (error) {
        console.error('Error creating materialLengthAdjustment: ', error);
        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.get('/', async (_: Request, response: Response) => {
  try {
    const materialLengthAdjustments = await MaterialLengthAdjustmentModel.find().populate('material').sort({ updatedAt: DESCENDING }).exec();

    return response.json(materialLengthAdjustments);
  } catch (error) {
      console.error('Error fetching material length adjustments: ', error);

      return response
          .status(SERVER_ERROR)
          .send(error.message);
  }
})

router.get('/search', async (request: Request<{}, {}, {}, SearchQuery>, response: Response) => {
  try {
    const { query, pageIndex = '0', limit = '10', sortField, sortDirection } = request.query as SearchQuery;
    const pageNumber = Math.max(0, parseInt(pageIndex, 10));
    const pageSize = Math.max(50, parseInt(limit, 10));
    const numDocsToSkip = pageNumber * pageSize;
    console.log('sortField: ', sortField)
    console.log('sortDirection: ', sortDirection)
    const sortOptions: SortOption = (sortField && sortDirection && ['asc', 'desc'].includes(sortDirection)) 
      ? { [sortField]: sortDirection === 'desc' ? -1 : 1 } : DEFAULT_SORT_OPTIONS;

    console.log('sort options 111: ', sortOptions)
    const textSearch = query && query.length
    ? {
        $or: [
          { notes: { $regex: query, $options: 'i' } },
          { 'material.name': { $regex: query, $options: 'i' } },
          { 'material.materialId': { $regex: query, $options: 'i' } },
          { 'material.productNumber': { $regex: query, $options: 'i' } },
          { 'material.location': { $regex: query, $options: 'i' } },
        ],
      }
    : {};

    const pipeline = [
      {
        $match: {
          ...textSearch, // Add text search conditions
        },
      },
      // Always include the material lookup
      {
        $lookup: {
          from: 'materials',       // The collection for the Material model
          localField: 'material',  // Field in Order referencing the Material
          foreignField: '_id',     // Field in Material for matching
          as: 'material',
        },
      },
      {
        $unwind: {
          path: '$material',
          preserveNullAndEmptyArrays: true, // In case material is not populated
        },
      },
      { 
        $sort: {
          ...sortOptions
        },
      },
      { $skip: numDocsToSkip },
      { $limit: pageSize },
      // Project the desired fields
      {
        $project: {
          ...Object.fromEntries(Object.keys(MaterialLengthAdjustmentModel.schema.paths).map(key => [key, `$${key}`])),
          material: "$material"
        },
      },
    ];

    const materialLengthAdjustments = await MaterialLengthAdjustmentModel.aggregate<IMaterialLengthAdjustment>(pipeline);

    const totalDocumentCount = await MaterialLengthAdjustmentModel.countDocuments();
    const totalPages = Math.ceil(totalDocumentCount / pageSize);

    const results: SearchResult<IMaterialLengthAdjustment> = {
      totalResults: totalDocumentCount,
      totalPages: totalPages,
      currentPage: pageNumber,
      results: materialLengthAdjustments,
      pageSize: pageSize
    }

    console.log('pagination results: ', JSON.stringify(results.results))

    return response.json(results)

  } catch (error) {
    console.error('Error during material-length-adjustment search:', error);
    return response.status(500).send(error.message);
  }
});

router.get('/:mongooseId', async (request: Request, response: Response) => {
  try {
    const materialLengthAdjustment = await MaterialLengthAdjustmentModel.findById(request.params.mongooseId);

    return response.json(materialLengthAdjustment);
  } catch (error) {
      console.error('Error searching for materialLengthAdjustment: ', error);

      return response
          .status(SERVER_ERROR)
          .send(error.message);
  }
})

router.patch('/:mongooseId', async (request: Request, response: Response) => {
  try {
      const updatedMaterialLengthAdjustment = await MaterialLengthAdjustmentModel.findOneAndUpdate(
          { _id: request.params.mongooseId }, 
          { $set: request.body }, 
          { runValidators: true, new: true }
      ).exec();

      return response.json(updatedMaterialLengthAdjustment);
  } catch (error) {
      console.error('Failed to update materialLengthAdjustment: ', error);

      return response
          .status(SERVER_ERROR)
          .send(error.message);
  }
});

router.delete('/:mongooseId', async (request: Request, response: Response) => {
  try { 
      const deletedMaterialLengthAdjustment = await MaterialLengthAdjustmentModel.findByIdAndDelete(request.params.mongooseId).exec();

      return response.status(SUCCESS).json(deletedMaterialLengthAdjustment);
  } catch (error) {
      console.error('Failed to delete materialLengthAdjustment: ', error);

      return response.status(SERVER_ERROR).send(error.message);
  }
});

export default router;