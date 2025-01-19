import { Router, Request, Response } from 'express';
const router = Router();
import { BAD_REQUEST, CREATED_SUCCESSFULLY, SERVER_ERROR, SUCCESS } from '../enums/httpStatusCodes.ts';
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
    const { query, pageIndex, limit, sortField, sortDirection } = request.query as SearchQuery;

    if (!pageIndex || !limit) return response.status(BAD_REQUEST).json('Invalid page index or limit');

    const pageNumber = parseInt(pageIndex, 10);
    const pageSize = parseInt(limit, 10);
    const numDocsToSkip = pageNumber * pageSize;
    const sortOptions: SortOption = (sortField && sortDirection && ['asc', 'desc'].includes(sortDirection)) 
      ? { [sortField]: sortDirection === 'desc' ? -1 : 1 } : DEFAULT_SORT_OPTIONS;

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
        $facet: {
          paginatedResults: [
            { $sort: { ...sortOptions } },
            { $skip: numDocsToSkip },
            { $limit: pageSize },
            {
              $project: {
                ...Object.fromEntries(Object.keys(MaterialLengthAdjustmentModel.schema.paths).map(key => [key, `$${key}`])),
                material: '$material',
              },
            },
          ],
          totalCount: [
            { $count: 'count' },
          ],
        },
      },
    ];

    const results = await MaterialLengthAdjustmentModel.aggregate<any>(pipeline);
    const totalDocumentCount = results[0]?.totalCount[0]?.count || 0; // Extract total count
    const materialLengthAdjustments = results[0]?.paginatedResults || [];
    const totalPages = Math.ceil(totalDocumentCount / pageSize);

    const paginationResponse: SearchResult<IMaterialLengthAdjustment> = {
      totalResults: totalDocumentCount,
      totalPages,
      currentPage: pageNumber,
      results: materialLengthAdjustments,
      pageSize,
    }

    return response.json(paginationResponse)

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