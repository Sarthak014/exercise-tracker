const { User } = require("../model/User");
const { getDateFromMilli } = require("../utilities/getDate");
const {
  logResultsWithFromTo,
  getLogDateWithDateString,
  getDateQueryAndRange,
  isLogDateInRange,
} = require("../utilities/logResultsWithFromTo");
const { isLimitValid, isDateValid } = require("../utilities/validate");

// Create new user
const createUser = (username, done) => {
  let user = new User({
    username,
  });

  user
    .save()
    .then((res) => {
      const response = { username: res?.username, _id: res?._id };

      done(null, response); // success
    })
    .catch((err) => {
      console.log("error saving data: ", err);
      done(err, null); // failure
    });
};

// Get all the users from db and return it to client side
const getAllUsers = async (done) => {
  try {
    const allUsers = await User.find({}, { _id: 1, username: 1 });

    if (!allUsers) {
      throw new Error("No users found");
    }

    done(null, allUsers);
  } catch (error) {
    done(error, null);
  }
};

// Add exercise details into db for the specific user
const addExerciseDetail = async (userId, exerciseDetail, done) => {
  try {
    let { description, duration, date } = exerciseDetail;

    const newExerciseLog = {
      description,
      duration: parseInt(duration),
      date: date ? new Date(date).getTime() : new Date().getTime(),
    };

    // Calculate the size of the log array
    const logSize = await User.findById(userId)
      .select("log")
      .then((user) => user.log.length);

    await User.updateOne(
      { _id: userId },
      {
        $push: {
          log: {
            $each: [newExerciseLog],
            $sort: { date: -1 },
          },
        },
        $set: { count: logSize + 1 },
      }
    ).exec();

    const userData = await User.findById({ _id: userId });

    const response = {
      _id: userId,
      username: userData.username,
      ...newExerciseLog,
      date: getDateFromMilli(newExerciseLog.date),
    };

    done(null, response);
  } catch (error) {
    console.error(error);
    done(error, null);
  }
};

// Get Full Logs for a certain user by ID
// and return them as JSON object in the callback function
const getUserLogsByIdAndQuery = async (
  { _id: userId, from: fromDate, to: toDate, limit },
  done
) => {
  try {
    const isQueryDateValid = isDateValid(fromDate) || isDateValid(toDate);

    let userData = await User.findById(
      { _id: userId },
      { __v: 0, createdAt: 0, updatedAt: 0, "log._id": 0 }
    ).exec();

    if (!userData) throw new Error("No users found");

    userData = userData.toObject();

    if (isQueryDateValid) {
      const startDate = fromDate ? new Date(fromDate).getTime() : null;
      const endDate = toDate ? new Date(toDate).getTime() : null;
      const { dateQuery, dateRange } = getDateQueryAndRange(startDate, endDate);

      const { log } = userData;

      const filteredUserLog = log
        .filter(({ date }) =>
          isLogDateInRange(date, dateQuery, startDate, endDate)
        )
        .map(({ description, duration, date }) => ({
          description,
          duration,
          date: getDateFromMilli(date),
        }));

      userData = {
        _id: userData._id,
        username: userData.username,
        ...dateRange,
        count: filteredUserLog.length,
        log: filteredUserLog,
      };
    }

    if (isLimitValid(limit)) {
      userData.log = userData.log.slice(0, parseInt(limit));
      userData.count = userData.log.length;
    }

    const userResponse = {
      ...userData,
      log: userData.log ? getLogDateWithDateString(userData.log) : [],
    };

    done(null, userResponse);
  } catch (error) {
    console.error("Error: ", error);
    done(error, null);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  addExerciseDetail,
  getUserLogsByIdAndQuery,
};
