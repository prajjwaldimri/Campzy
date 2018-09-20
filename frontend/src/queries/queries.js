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
    }
  }
  `;

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
          amenities,
          placesOfInterest,
          tags,
          images,
          isAvailable,
          campDocuments
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
      amenities,

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
    amenities,
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
};
