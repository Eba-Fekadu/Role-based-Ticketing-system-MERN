import { Modal, Table, Button, Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function About() {
  const { currentUser } = useSelector((state) => state.user);
  
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getTickets?userId=${currentUser._id}&role=${currentUser.role}`);
        const data = await res.json();
        
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  
    if (currentUser) {
     
      fetchPosts();
    }
  }, [currentUser]);
  
  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getTickets?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const handleOpenUpdateModal = (post) => {
    setSelectedPost(post);
    setNewStatus(post.status);
    setShowModal(true);
  };

  const handleupdateTicket = async () => {
    if (!selectedPost) return;
    
    try {
      const res = await fetch(
        `/api/post/updateTicket/${selectedPost._id}/${currentUser._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      
      if (res.ok) {
        setUserPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === selectedPost._id ? { ...post, status: newStatus } : post
          )
        );
        setShowModal(false);
      } else {
        console.error("Failed to update post:", data);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      { userPosts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Ticket title</Table.HeadCell>
              
              <Table.HeadCell>status</Table.HeadCell>
              
             
            { currentUser.role == "admin" &&(
              <Table.HeadCell>
                <span>Update</span>
              </Table.HeadCell>
              )}
            </Table.Head>
            {userPosts.map((post) => (
              // eslint-disable-next-line react/jsx-key
              <Table.Body key={post._id} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                 
                  <Table.Cell>
                    <Link
                      className="font-medium text-blue-400 dark:text-blue-400 hover:underline"
                      to={`/ticket/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>

                  {/* { currentUser.role == "user" ? ( */}
                  <Table.Cell>
                    {post.status}
                  </Table.Cell>
                 
                

                  { currentUser.role == "admin" && (
                  <Table.Cell>
                    <button
               className="bg-teal-500 text-white px-3 py-1 rounded-md hover:bg-teal-600 focus:ring-2 focus:ring-teal-300 dark:focus:ring-teal-700"
              onClick={() => handleOpenUpdateModal(post)}
            >
                      Update Status
                    </button>
                  </Table.Cell>
                )}
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>loading...! or You have no posts yet! </p>
      )}

{selectedPost && (
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Update Status for <strong>{selectedPost.title}</strong>
              </h3>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="rounded p-2 w-full"
              >
                <option value="open">Open</option>
                <option value="in progress">In progress</option>
                <option value="closed">Closed</option>
              </Select>
              <div className="flex justify-center gap-4 mt-5">
                <Button  className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 focus:ring-2 focus:ring-teal-300 dark:focus:ring-teal-700" onClick={handleupdateTicket}>
                  Save Changes
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}

    </div>
  );
}