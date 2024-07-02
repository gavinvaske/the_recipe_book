import { TextFilter, ConditionalFilter } from "../../_types/Filters"
import { MaterialInventory } from "../Inventory"
import { v4 as uuidv4 } from 'uuid';

export const textQuickFilters: TextFilter[] = [
  {
    description: 'materials',
    options: [
      {
        uuid: uuidv4(),
        value: 'semi-gloss'
      },
      {
        uuid: uuidv4(),
        value: 'matte'
      },
    ]
  },
  {
    description: 'Foo',
    options: [
      {
        uuid: uuidv4(),
        value: 'bar'
      },
    ]
  }
]

export const conditionalQuickFilters: ConditionalFilter<MaterialInventory>[] = [
  {
    uuid: uuidv4(),
    textToDisplay: 'This text is rendered',
    conditionalFilter: (objects: Partial<MaterialInventory>[]) => {
      return objects.filter((object) => {
        return object?.material?.name?.toLowerCase() === 'foo'
      })
    }
  }
]