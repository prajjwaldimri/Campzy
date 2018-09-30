// User log in
const sendUserCredentials = `query loginUser($loginEmail: String!,$loginPassword: String!){
        loginUser(email: $loginEmail, password: $loginPassword){
          jwt
        }
      }`;

// Get all users for admin

const getAllUsers = `query ($page: Int){
  allUsers(page: $page){
    id
    name
    phoneNumber
  }
}`;

const getAllTentsQuery = `query allTents{
    allTents{
      id
      type
      capacity
      bookingPrice
      preBookPeriod
      isBooked
      isAvailable
      surgePrice
      disabledDates
    }
  }
  `;

const getTentById = `query tent($id: String!){
    tent(id: $id){
      id
      capacity
      type
      bookingPrice
      preBookPeriod
      surgePrice
      isAvailable
      disabledDates
    }
  }`;

const countTents = `query countCampTents{
  countCampTents{
    count,
}}`;

const countBookedTent = `query countBookedTent{
  countBookedTent{
    bookedTentCount,
  }
}`;

const getCurrentUserCampDetails = `query currentUserCamp{
        currentUserCamp {
          id,
          ownerId,
          name,
          email,
          phoneNumber,
          url,
          shortDescription,
          longDescription,
          placesOfInterest,
          amenities{
            washRoomAttached,
            bonfire,
            hotWater,
            mobileConnectivity,
            mealsInclude,
            petsAllowed,
            chargingPoints,

          },
          tags,
          images,
          isAvailable,
          campDocuments
        }

      }`;

const getWishList = `query getUserWishlist{
    getUserWishlist{
      wishlist
    }
  }`;

const getCampDetail = `query camp($id: String!){
  camp(id: $id){
      name,
      email,
      phoneNumber,
      url,
      location,
      shortDescription,
      longDescription,
      placesOfInterest,
      tags,
      amenities{
        washRoomAttached,
        bonfire,
        hotWater,
        mobileConnectivity,
        mealsInclude,
        petsAllowed,
        chargingPoints,
      },

  }
}
`;

// Gets camp details available in public
const getCampByUrl = `query campUser($url: String!){
  campUser(url: $url){
    id,
    name,
    location,
    shortDescription,
    longDescription,
    placesOfInterest,
    tags,
    amenities{
      washRoomAttached,
      bonfire,
      hotWater,
      mobileConnectivity,
      mealsInclude,
      petsAllowed,
      chargingPoints,
    },
    images,
    isAvailable,
    inventory{
      capacity
    },
    coordinates {
      latitude,
      longitude
    },
    terrain,
    rating,
  }
}`;

const getBestTentAvailable = `query bestTentinCamp($url: String!, $tentCount: Int!, $personCount: Int!, $bookingStartDate: Int!){
  bestTentinCamp(url: $url, tentCount: $tentCount, personCount: $personCount, bookingStartDate: $bookingStartDate){
    id,
    capacity,
    bookingPrice
  }
}`;

// Count all camps present in model
const countAllCamps = `query countCamps{
  countCamps{
      count,
  }
}`;

const countAllUsers = `query countUsers{
  countUsers{
      count,
  }
}`;

const userSearch = `query searchUniqueUser($searchTerm: String, $page: Int!){
  searchUniqueUser(searchTerm : $searchTerm, page: $page){
      id,
      name,
      phoneNumber
  }
}`;

const campSearch = `query searchCamp($searchTerm: String, $page: Int!){
  searchCamp(searchTerm : $searchTerm, page: $page){
      id,
      tags,
      name,
      phoneNumber,
      email,
      location,
      url,
      owner {
        name
      }

  }
}`;

const campSearchUser = `query campSearchUser($searchTerm: String!, $page: Int!, $bookingStartDate: Int!, $minPrice: Int!, $maxPrice: Int!, $tentCount: Int!, $personCount: Int!, $tripDuration: Int!) {
  campSearchUser(searchTerm: $searchTerm, page: $page, bookingStartDate: $bookingStartDate, minPrice: $minPrice, maxPrice: $maxPrice, tentCount: $tentCount, personCount: $personCount, tripDuration: $tripDuration){
    id,
    name,
    location,
    url,
    heroImage,
    rating,
    inventory {
      bookingPrice
    }
  }
}`;
const getCurrentUserBlogsQuery = `query currentUserBlogs{
  currentUserBlogs {
    blogs {
      id
      title
      content
      description
      url
      heroImageCaption,
      heroImage
    }
  }
}`;

const getBlogQuery = `query getBlog($url: String!){
  getBlog(url: $url){
    title,
    description,
    content,
    heroImage,
    heroImageCaption,
    authorId {
      name
    }
  }
}`;

const getBlogById = `query getUpdateBlog($id: String!){
  getUpdateBlog(id: $id){
    title,
    content,
    description,
    url,
    heroImageCaption,
    heroImage
}}`;

const isEmailAvailable = `query isEmailAvailable($email: String!){
  isEmailAvailable(email: $email){
    id
  }
}`;

const getUserActiveBookings = `query getUserActiveBookings {
  getUserActiveBookings{
    code,
    user{
      name
    },
    tentCount,
    personCount,
    camp{
      name,
      url,
      location
    },
    amount,
    startDate,
    endDate
  }
}`;

const campBookings = `query campBookings($id : String!){
        campBookings(id : $id){
            user {
              name
            },
            tentCount,
           startDate,
           endDate,
           personCount,
           amount,
        }
      }`;

const countCampActiveBooking = `query countCampActiveBookings($id: String!){
  countCampActiveBookings(id: $id){
    countActiveBooking
  }
}`;

const getLatestCampForReview = `query getLatestCampForReview{
  getLatestCampForReview{
    id,
    name
  }
}`;

module.exports = {
  sendUserCredentials,
  getAllUsers,
  getAllTentsQuery,
  getCurrentUserCampDetails,
  getCampDetail,
  countAllCamps,
  countAllUsers,
  userSearch,
  campSearch,
  campSearchUser,
  getCampByUrl,
  getBestTentAvailable,
  getCurrentUserBlogsQuery,
  getBlogQuery,
  getBlogById,
  isEmailAvailable,
  getUserActiveBookings,
  campBookings,
  countTents,
  countBookedTent,
  countCampActiveBooking,
  getWishList,
  getLatestCampForReview,
  getTentById,
};
