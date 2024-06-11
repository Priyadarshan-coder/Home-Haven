import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [offerPage, setOfferPage] = useState(1);
  const [salePage, setSalePage] = useState(1);
  const [rentPage, setRentPage] = useState(1);

  const listingsPerPage = 3;

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListings = async (query, setter) => {
      try {
        const res = await fetch(`/api/listing/get?${query}&limit=12`);
        const data = await res.json();
        setter(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchListings('offer=true', setOfferListings);
    fetchListings('type=rent', setRentListings);
    fetchListings('type=sale', setSaleListings);
  }, []);

  const selectPageHandler = (setPage, listings, selectedPage) => {
    if (selectedPage >= 1 && selectedPage <= Math.ceil(listings.length / listingsPerPage)) {
      setPage(selectedPage);
    }
  };

  const paginate = (listings, currentPage) => {
    const startIndex = (currentPage - 1) * listingsPerPage;
    return listings.slice(startIndex, startIndex + listingsPerPage);
  };

  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Your one-stop <span className='text-slate-500'>destination</span>
          <br />
          for homes
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Home Haven is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale, and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {paginate(offerListings, offerPage).map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
            <div className='flex justify-center my-4'>
              <span
                onClick={() => selectPageHandler(setOfferPage, offerListings, offerPage - 1)}
                className={`px-4 py-2 border ${offerPage > 1 ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              >
                ◀
              </span>
              {[...Array(Math.ceil(offerListings.length / listingsPerPage))].map((_, i) => (
                <span
                  key={i}
                  className={`px-4 py-2 border cursor-pointer ${offerPage === i + 1 ? 'bg-gray-300' : ''}`}
                  onClick={() => selectPageHandler(setOfferPage, offerListings, i + 1)}
                >
                  {i + 1}
                </span>
              ))}
              <span
                onClick={() => selectPageHandler(setOfferPage, offerListings, offerPage + 1)}
                className={`px-4 py-2 border ${offerPage < Math.ceil(offerListings.length / listingsPerPage) ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              >
                ▶
              </span>
            </div>
          </div>
        )}

        {rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {paginate(rentListings, rentPage).map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
            <div className='flex justify-center my-4'>
              <span
                onClick={() => selectPageHandler(setRentPage, rentListings, rentPage - 1)}
                className={`px-4 py-2 border ${rentPage > 1 ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              >
                ◀
              </span>
              {[...Array(Math.ceil(rentListings.length / listingsPerPage))].map((_, i) => (
                <span
                  key={i}
                  className={`px-4 py-2 border cursor-pointer ${rentPage === i + 1 ? 'bg-gray-300' : ''}`}
                  onClick={() => selectPageHandler(setRentPage, rentListings, i + 1)}
                >
                  {i + 1}
                </span>
              ))}
              <span
                onClick={() => selectPageHandler(setRentPage, rentListings, rentPage + 1)}
                className={`px-4 py-2 border ${rentPage < Math.ceil(rentListings.length / listingsPerPage) ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              >
                ▶
              </span>
            </div>
          </div>
        )}

        {saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
                Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {paginate(saleListings, salePage).map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
            <div className='flex justify-center my-4'>
              <span
                onClick={() => selectPageHandler(setSalePage, saleListings, salePage - 1)}
                className={`px-4 py-2 border ${salePage > 1 ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              >
                ◀
              </span>
              {[...Array(Math.ceil(saleListings.length / listingsPerPage))].map((_, i) => (
                <span
                  key={i}
                  className={`px-4 py-2 border cursor-pointer ${salePage === i + 1 ? 'bg-gray-300' : ''}`}
                  onClick={() => selectPageHandler(setSalePage, saleListings, i + 1)}
                >
                  {i + 1}
                </span>
              ))}
              <span
                onClick={() => selectPageHandler(setSalePage, saleListings, salePage + 1)}
                className={`px-4 py-2 border ${salePage < Math.ceil(saleListings.length / listingsPerPage) ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              >
                ▶
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
