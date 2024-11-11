import { Link } from 'react-router-dom';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle, BiShow } from 'react-icons/bi';
import { TbStatusChange } from 'react-icons/tb';
import { BsInfoCircle } from 'react-icons/bs';
import BookModal from './BookModal';
import { useState } from 'react';

const BookSingleCard = ({ book }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl">
      <h2 className="absolute top-1 right-2 px-4 py-1 bg-red-300 rounded-lg text-sm">
        {book.status}
      </h2>
      <h4 className="my-2 text-gray-500 text-sm">{book._id}</h4>
      <div className="flex justify-start items-center gap-x-2">
        <PiBookOpenTextLight className="text-red-300 text-2xl" />
        <h2 className="my-1 text-lg">{book.title}</h2>
      </div>
      <div className="flex justify-start items-center gap-x-2">
        <BiUserCircle className="text-red-300 text-2xl" />
        <h2 className="my-1 text-lg">{book.author}</h2>
      </div>
      <div className="flex justify-start items-center gap-x-2">
        <TbStatusChange className="text-green-300 text-2xl" />
        <h2 className="my-1 text-lg">{book.status}</h2>
      </div>
      <div className="flex justify-between items-center gap-x-2 mt-4 p-4">
        <BiShow
          className="text-3xl text-blue-800 hover:text-black cursor-pointer"
          onClick={() => setShowModal(true)}
        />
        <Link to={`/books/details/${book.id}`}>
          <BsInfoCircle className="text-2xl text-green-800 hover:text-black" />
        </Link>
      </div>
      {showModal && <BookModal book={book} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default BookSingleCard;
