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
          ownerId{
            id
          },
          name,
          email,
          phoneNumber,
          url,
          shortDescription,
          longDescription,
          placesOfInterest{
            name,
            distance
          },
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
          campDocuments,
          location,
          agreementAccepted,
        }

      }`;

const getWishList = `query getUserWishlist{
    getUserWishlist{
      wishlist
    }
  }`;

const getWishlistInProfile = `query getWishlistInProfile{
    getWishlistInProfile{
      localWishlist{
        id,
        name,
        url,location,
        shortDescription,
        averageRating,
        email,
      }
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
      placesOfInterest{
        name,
        distance
      },
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
      bank{
        beneficiary
        accountType
        accountNumber
        IFSCCode
      }
      gst,
      campDocuments,
      images,

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
    placesOfInterest{
      name,
      distance
    }
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
    heroImage,
    images,
    isAvailable,
    inventory{
      capacity
    },
    temperature,
    temperatureSummary,
    coordinates {
      latitude,
      longitude
    },
    terrain {
      glacier,
      forest,
      desert,
      ocean,
      hill,
      river
    },
    averageRating,
    ratingsCount,
  }
}`;

const getCampImages = `query getImagesOfCamp($url: String!){
  getImagesOfCamp(url: $url){
    id,
    name,
    images,
  }
}`;

const getBestTentAvailable = `query bestTentInCamp($url: String!, $tentCount: Int!, $personCount: Int!, $preBookPeriod: Int!, $bookingStartDate: Date!, $bookingEndDate: Date!){
  bestTentInCamp(url: $url, tentCount: $tentCount, personCount: $personCount, preBookPeriod: $preBookPeriod, bookingStartDate: $bookingStartDate, bookingEndDate: $bookingEndDate){
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

const campSearch = `query searchCamp($searchTerm: String!, $page: Int!){
  searchCamp(searchTerm : $searchTerm, page: $page){
      id,
      tags,
      name,
      phoneNumber,
      email,
      location,
      url,
      ownerId {
        id
        name
      },
  }
}`;

const campSearchUser = `query campSearchUser($searchTerm: String!, $page: Int!, $bookingStartDate: Date!, $bookingEndDate: Date!, $preBookPeriod: Int!, $minPrice: Int!, $maxPrice: Int!, $tentCount: Int!, $personCount: Int!, $tripDuration: Int!, $amenities: [String]) {
  campSearchUser(searchTerm: $searchTerm, page: $page, bookingStartDate: $bookingStartDate, bookingEndDate: $bookingEndDate, preBookPeriod: $preBookPeriod, minPrice: $minPrice, maxPrice: $maxPrice, tentCount: $tentCount, personCount: $personCount, tripDuration: $tripDuration, amenities: $amenities){
    id,
    name,
    location,
    url,
    heroImage,
    averageRating,
    inventory {
      id,
      bookingPrice
    },
    temperature,
    temperatureSummary,
    terrain {
      glacier,
      forest,
      desert,
      ocean,
      hill,
      river
    },
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
    },
    createdAt
  }
}`;

const getAllBlogs = `query getAllBlogs($page: Int!){
  getAllBlogs(page: $page){
    title,
    heroImage,
    url,
    darkTheme
  }
}`;

const getBlogById = `query getUpdateBlog($id: String!){
  getUpdateBlog(id: $id){
    title,
    content,
    description,
    url,
    heroImageCaption,
    heroImage,
    darkTheme,
}}`;

const isEmailAvailable = `query isEmailAvailable($email: String!){
  isEmailAvailable(email: $email){
    id
  }
}`;

const getUserBookings = `query getUserBookings($active: Boolean, $past: Boolean) {
  getUserBookings(active: $active, past: $past){
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

const campBookings = `query campBookings($id : String!, $active: Boolean!, $past: Boolean!, $page: Int){
        campBookings(id : $id, active: $active, past: $past, page: $page){
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

const getReviewsForCamp = `query getReviewsForCamp($campId: String!){
  getReviewsForCamp(campId: $campId){
    stars,
    comment,
    user{
      name
    },
    createdAt
  }
}`;

const allBookings = `query allBookings($active: Boolean!, $past: Boolean!, $page: Int){
        allBookings(active: $active, past: $past, page: $page){
          user {
              name
            },
            tentCount,
           startDate,
           endDate,
           personCount,
           amount,
           camp{
             name,
             url,
           },
           code
        }
      }`;

const countCampPastBookings = `query countCampPastBookings($id: String!){
    countCampPastBookings(id: $id){
      bookingCount
    }
  }`;
const countAdminPastBookings = `query countAdminPastBookings{
    countAdminPastBookings{
      bookingCount
    }
  }`;

const isCampUrlAvailable = `query isCampUrlAvailable($url: String!){
  isCampUrlAvailable(url: $url){
    id
  }
}`;

const isIFSCValid = `query isIFSCValid($IFSCCode: String!){
  isIFSCValid(IFSCCode: $IFSCCode)

}`;

const getIFSCDetails = `query getIFSCDetails($IFSCCode: String!){
  getIFSCDetails(IFSCCode: $IFSCCode){
    BRANCH,
    BANK,
    ADDRESS,
    CITY,
    DISTRICT,
    STATE
  }
}`;

const getBankDetails = `query getBankDetails{
  getBankDetails{
    razorpayAccountId,
    bank{
      beneficiary,
      accountNumber,
      IFSCCode,
      accountType,
    }
    agreementAccepted,
  }
}`;

const getCampRequests = `query getAllRequests{
  getAllRequests{
    id,
    name,
    phoneNumber,
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
  getCampImages,
  getBestTentAvailable,
  getCurrentUserBlogsQuery,
  getBlogQuery,
  getBlogById,
  getAllBlogs,
  isEmailAvailable,
  getUserBookings,
  campBookings,
  countTents,
  countBookedTent,
  countCampActiveBooking,
  getWishList,
  getLatestCampForReview,
  getTentById,
  getReviewsForCamp,
  getWishlistInProfile,
  allBookings,
  isCampUrlAvailable,
  isIFSCValid,
  getIFSCDetails,
  getBankDetails,
  getCampRequests,
  countAdminPastBookings,
  countCampPastBookings,
};
