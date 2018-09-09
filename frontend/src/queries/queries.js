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
      bookingPriceAdult
      bookingPriceChildren
      preBookPeriod
      isBooked
      surgePriceAdult
      surgePriceChildren
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
          isAvailable
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
    name,
    location,
    shortDescription,
    longDescription,
    placesOfInterest,
    tags,
    amenities,
    images,
    isAvailable,
    inventory {
      bookingPriceAdult,
      bookingPriceChildren
    }
    coordinates {
      latitude,
      longitude
    },
    terrain,
    rating,
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

const campSearchUser = `query campSearchUser($searchTerm: String!, $page: Int!, $bookingStartDate: Int!, $minPrice: Int!, $maxPrice: Int!) {
  campSearchUser(searchTerm: $searchTerm, page: $page, bookingStartDate: $bookingStartDate, minPrice: $minPrice, maxPrice: $maxPrice){
    id,
    name,
    location,
    url,
    heroImage,
    rating,
    inventory {
      bookingPriceAdult,
      bookingPriceChildren
    }
  }
}`;
const getCurrentUserBlogs = `query currentUserBlogs{
  currentUserBlogs{
    id
    title
    content
    url
    heroImage
  }
}`;

// eslint-disable-next-line
export {
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
  getCurrentUserBlogs,
};
