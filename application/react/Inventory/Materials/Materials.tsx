import React, { useCallback } from 'react';
import './Materials.scss'
import { observer } from 'mobx-react-lite';
import Material from './Material/Material';
import inventorySummaryStore from '../../stores/inventorySummaryStore';
import { useQuery } from '@tanstack/react-query';
import { getMaterials } from '../../_queries/material';
import { LoadingIndicator } from '../../_global/LoadingIndicator/LoadingIndicator';

const Materials = observer(() => {
  const materials = inventorySummaryStore.getMaterials() || []
  const callback = useCallback(() => {}, []) // TODO: Implement this hook properly for state updates in Materials component

  const { isPending } = useQuery({
    queryKey: ['get-materials'],
    queryFn: async () => {
      const materials = await getMaterials();
      inventorySummaryStore.setMaterials(materials)

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