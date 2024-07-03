const MaterialInventoryEntryModel = require('../models/materialInventoryEntry')

/* 
  @See: 
    https://mongoplayground.net/
  
  @Returns: 
    A map where the key is the material _id which maps to the net length of that material found in the MaterialInventoryEntry db table
  
  @Notes:
    type materialIdWithTotalLength = {
      _id: mongooseId,
      totalLength: number
    }
*/
module.exports.groupInventoryEntriesByMaterial = async () => {
  const materialIdsWithTotalLength = await MaterialInventoryEntryModel.aggregate([
    {
      $group: {
        _id: "$material",
        totalLength: {
          $sum: {
            "$toDouble": "$length"
          }
        }
      }
    }
  ]);

  const materialIdToTotalLength = {}

  materialIdsWithTotalLength.forEach(({_id, totalLength}) => {
    materialIdToTotalLength[_id] = totalLength 
  })

  return materialIdToTotalLength
}