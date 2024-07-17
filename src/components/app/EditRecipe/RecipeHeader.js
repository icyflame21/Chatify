import PageHeader from 'components/common/PageHeader';
import React from 'react';

const RecipeHeader = () => {
  const CreateRecipeBg = 'https://i.ibb.co/pPCDTst/corner-1.webp'
  return (
    <PageHeader
      title="Edit Recipe"
      image={CreateRecipeBg}
    >
    </PageHeader>
  );
};

export default RecipeHeader;
