import { useState } from 'react';

const CreateQuoteForm = () => {
  const [name, setName] = useState('');

  return (
    <form>
      <label>Enter Your Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
    </form>
  )
}

export default CreateQuoteForm;