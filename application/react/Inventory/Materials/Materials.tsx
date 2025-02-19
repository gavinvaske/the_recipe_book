import React, { useCallback } from 'react';
import './Materials.scss'
import { observer } from 'mobx-react-lite';
import Material from './Material/Material';
import { IMaterial } from '@shared/types/models';

type Props = {
  materials: IMaterial[],
}

const Materials = observer((props: Props) => {
  const { materials } = props;

  return (
    <div className='material-card-section full-width'>
      {materials.map((material) =>
        <Material 
          material={material}
          key={material._id as string}
          onClick={useCallback(() => {}, [])} // TODO: Implement this hook properly for state updates in Material component
        />
      )}
    </div>
  )
});

export default Materials;