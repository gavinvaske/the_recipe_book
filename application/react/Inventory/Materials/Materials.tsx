import React, { useCallback } from 'react';
import './Materials.scss'
import { observer } from 'mobx-react-lite';
import Material from './Material/Material';
import inventoryStore from '../../stores/inventoryStore';
import { useQuery } from '@tanstack/react-query';
import { getMaterials } from '../../_queries/material';
import { LoadingIndicator } from '../../_global/LoadingIndicator/LoadingIndicator';
import { useWebsocket } from '../../_hooks/useWebsocket';
import { IMaterial } from '@shared/types/models';
import { MongooseIdStr } from '@shared/types/typeAliases';

const Materials = observer(() => {
  const materials = inventoryStore.getSortedMaterials()
  const callback = useCallback(() => {}, []) // TODO: Implement this hook properly for state updates in Materials component

  useWebsocket('MATERIAL:CREATED', (material: IMaterial) => {
    inventoryStore.setMaterial(material)
  })

  useWebsocket('MATERIAL:UPDATED', (material: IMaterial) => {
    inventoryStore.setMaterial(material)
  })

  useWebsocket('MATERIAL:DELETED', (materialMongooseId: MongooseIdStr) => {
    inventoryStore.removeMaterial(materialMongooseId)
  })

  const { isPending } = useQuery({
    queryKey: ['get-materials'],
    queryFn: async () => {
      const materials = await getMaterials();
      inventoryStore.setMaterials(materials)

      return materials
    },
    initialData: []
  })

  if (isPending) return <LoadingIndicator />;

  return (
    <div className='material-card-section full-width'>
      {materials.map((material) =>
        <Material 
          material={material}
          key={material._id as string}
          onClick={callback} // TODO: Implement this hook properly for state updates in Material component
        />
      )}
    </div>
  )
});

export default Materials;