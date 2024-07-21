import moment from 'moment';
import 'moment-timezone';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

export const formatTimestamp = (timestamp) => {
  if (timestamp) {
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US')
    const date = timestamp.toDate()
    return timeAgo.format(date, 'twitter')
  }
};


export const getLastObject = (data) => {
  if (data && Object.keys(data).length > 0) {
    const keys = Object.keys(data);
    const lastKey = keys[keys.length - 1];
    const lastObjectArray = data[lastKey];
    const lastObject = lastObjectArray[lastObjectArray.length - 1];

    return lastObject;
  }

};

export const formatDate = (date, timezone) => {
  if (date) {
    const now = moment().tz(timezone);
    const createdAt = moment(date).tz(timezone);

    if (createdAt.isSame(now, 'day')) {
      return 'Today';
    } else if (createdAt.isSame(now.subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    } else if (createdAt.isSame(now, 'week')) {
      return createdAt.format('dddd');
    } else {
      return createdAt.format('ddd DD, YYYY');
    }
  }
}

export const convertTimestampToDate = (data) => {
  if (data) {
    return data?.toDate().toDateString()
  }
}