import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { useState } from 'react';

const BooksTable = ({ books, currentPage, pageSize, totalCount }) => {
  return (
    <>
      <div className="mb-4 text-black dark:text-gray-300">
        {currentPage * pageSize + 1} To {currentPage * pageSize + books.length} out of {totalCount} books.
      </div>
      <table className='w-full border-separate border-spacing-2'>
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="border border-slate-600 rounded-md px-4 py-2 text-left">SLN</th>
            <th className="border border-slate-600 rounded-md px-4 py-2 text-left">Book Title</th>
            <th className="border border-slate-600 rounded-md px-4 py-2 text-left max-md:hidden">
              Author Name
            </th>
            <th className="border border-slate-600 rounded-md px-4 py-2 text-left max-md:hidden w-24">
              Book Quantity
            </th>
            <th className="border border-slate-600 rounded-md px-4 py-2 text-left max-md:hidden w-24">
              Issued Quantity
            </th>
            <th className="border border-slate-600 rounded-md px-4 py-2 text-left w-20">Operations</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book.id} className="h-8 hover:bg-gray-200 transition-colors">
              <td className='border border-slate-700 rounded-md text-center'>
                {/* {index + 1} */}
                {currentPage * pageSize + index + 1}
              </td>
              <td className='border border-slate-700 rounded-md text-center'>
                {book.title}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                {book.author}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                {book.Stock}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                {book.Issues.length}
              </td>
              {/* {console.log(book.id)} */}
              <td className='border border-slate-700 rounded-md text-center'>
                <div className='flex justify-center gap-x-4'>
                  <Link to={`/books/details/${book.id}`}>
                    <BsInfoCircle className='text-2xl text-green-800' />
                  </Link>
                  <Link to={`/books/edit/${book.id}`}>
                    <AiOutlineEdit className='text-2xl text-yellow-600' />
                  </Link>
                  <Link to={`/books/delete/${book.id}`}>
                    <MdOutlineDelete className='text-2xl text-red-600' />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default BooksTable;
