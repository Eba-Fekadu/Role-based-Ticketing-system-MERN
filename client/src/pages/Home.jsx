import { Alert, Button, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/post/createTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/ticket/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
    <h1 className='text-center text-3xl my-7 font-semibold'>Create a ticket</h1>
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-4 sm:flex-row justify-between'>
        <TextInput
          type='text'
          placeholder='Title'
          required
          id='title'
          className='flex-1'
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />
       
      </div>
      
      {formData.image && (
        <img
          src={formData.image}
          alt='upload'
          className='w-full h-72 object-cover'
        />
      )}
      <ReactQuill
        theme='snow'
        placeholder='Write something...'
        className='h-72 mb-12'
        required
        onChange={(value) => {
          setFormData({ ...formData, content: value });
        }}
      />
      <Button type='submit' gradientDuoTone='greenToBlue'>
        Add
      </Button>
      {publishError && (
        <Alert className='mt-5' color='failure'>
          {publishError}
        </Alert>
      )}
    </form>
  </div>
  );
}